import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameŠ } from "@/hooks/useMemoryGameŠ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

export default function SpominŠ() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();
  
  // Extract letter from URL path
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'š').toUpperCase();
  const { 
    cards, 
    isLoading, 
    error, 
    flipCard, 
    resetGame, 
    gameCompleted,
    matchedPairs,
    totalPairs,
    isCheckingMatch,
    showPairDialog,
    currentMatchedPair,
    handlePairDialogContinue,
    handlePairUnmatch
  } = useMemoryGameŠ();
  const gameStartTimeRef = useRef<number | null>(null);
  const [gameTime, setGameTime] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!gameStartTimeRef.current && cards.length > 0) {
      gameStartTimeRef.current = Date.now();
    }
    flipCard(index);
  };

  const handleReset = () => {
    resetGame();
    gameStartTimeRef.current = null;
    setGameTime(null);
    toast({
      title: "Igra je bila ponovno nastavljena!",
    });
  };

  // Enable fullscreen on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      requestFullscreen();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);

  useEffect(() => {
    if (gameCompleted && gameStartTimeRef.current && gameTime === null) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - gameStartTimeRef.current) / 1000);
      setGameTime(timeTaken);
      
      setTimeout(() => {
        toast({
          title: "Čestitamo!",
          description: `Igra je končana v ${timeTaken} sekundah!`,
        });
      }, 500);
    }
  }, [gameCompleted, gameStartTimeRef, gameTime, toast]);

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/ozadje_1.jpg`;

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 overflow-hidden' : 'min-h-screen'} relative`}>
      {/* Background image layer */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`
        }}
      />
      
      <div className={`${effectiveFullscreen ? 'h-full flex flex-col' : 'container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4'}`}>
        
        {/* Top Section - Buttons */}
        <div className={`${effectiveFullscreen ? 'bg-dragon-green/5 p-3 flex-shrink-0 border-b' : 'p-4 flex-shrink-0'}`}>
          {effectiveFullscreen && (
            <h2 className="text-lg font-bold mb-3 text-center">Spomin Š</h2>
          )}
          <div className="flex justify-center gap-3">
            <MemoryExitConfirmationDialog onConfirm={() => navigate("/govorne-igre/spomin")}>
              <Button
                size={effectiveFullscreen ? "sm" : "default"}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
            </MemoryExitConfirmationDialog>
            
            <Button
              onClick={handleReset}
              size={effectiveFullscreen ? "sm" : "default"}
              className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            
            <Button
              onClick={() => setShowInfo(true)}
              size={effectiveFullscreen ? "sm" : "default"}
              variant="outline"
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Navodila
            </Button>
          </div>
          
          {!effectiveFullscreen && (
            <div className="text-center mt-3 text-sm">
              <span className="font-medium">Najdeni pari: </span>
              <span className="text-dragon-green font-bold">{matchedPairs.length}</span>
              <span className="text-muted-foreground"> od {totalPairs}</span>
              {gameCompleted && gameTime !== null && (
                <span className="ml-3 bg-dragon-green/10 text-dragon-green px-2 py-1 rounded-md text-xs font-medium">
                  Čas: {gameTime}s
                </span>
              )}
            </div>
          )}
        </div>

        <div className={`${effectiveFullscreen ? 'flex-1 px-2 pb-2 overflow-hidden' : 'flex-1 flex justify-center items-center min-h-0'}`}>
          <div className={`w-full ${effectiveFullscreen ? 'h-full' : 'max-w-4xl h-full'} flex items-center justify-center`}>
            {isLoading && (
              <div className="text-lg text-muted-foreground">Nalaganje igre...</div>
            )}
            
            {error && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                <p className="text-sm text-red-500">Poskusite znova kasneje.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => window.location.reload()}
                >
                  Poskusi znova
                </Button>
              </div>
            )}
            
            {!isLoading && !error && cards.length > 0 && (
              <MemoryGrid 
                cards={cards} 
                onCardClick={handleCardClick}
                isCheckingMatch={isCheckingMatch}
              />
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="text-center p-10 border rounded-lg">
                <p className="text-muted-foreground">
                  Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <InfoModal 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Navodila za igro Spomin"
        content="Ta igra je super za vadbo spomina in izgovorjave besed!

Klikni na dve ploščici in poskusi najti pravi par (sliko in besedo).

Ko najdeš par, se odpre okno z izgovorjavo – poslušaj in ponovi besedo na glas.

Če jo pravilno izgovoriš, se par obdrži!

Igra je končana, ko odkriješ vse pare in pravilno izgovoriš vse besede."
      />

      <MemoryPairDialog
        isOpen={showPairDialog}
        onClose={handlePairDialogContinue}
        onContinue={handlePairDialogContinue}
        onUnmatch={handlePairUnmatch}
        pairNumber={matchedPairs.length}
        totalPairs={totalPairs}
        imageUrl={currentMatchedPair?.image_url || null}
        word={currentMatchedPair?.word || null}
        audioUrl={currentMatchedPair?.audio_url || null}
      />
    </div>
  );
}
