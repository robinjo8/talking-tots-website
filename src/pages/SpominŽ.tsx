import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameŽ } from "@/hooks/useMemoryGameŽ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

export default function SpominŽ() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  
  // Extract letter from URL path
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'ž').toUpperCase();
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
  } = useMemoryGameŽ();
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

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/47412.jpg`;

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 overflow-hidden' : 'min-h-screen'} relative`}>
      {/* Background image layer */}
      <div 
        className={`${effectiveFullscreen ? 'fixed' : 'absolute'} inset-0 w-full h-full bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`
        }}
      />
      
      <div className={`relative z-10 ${effectiveFullscreen ? 'h-full flex items-center justify-center overflow-hidden' : 'container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4'}`}>
        {effectiveFullscreen ? (
          <div className="w-full px-2">
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
              <>
                <div className="my-[160px]">
                  <MemoryGrid
                    cards={cards}
                    onCardClick={handleCardClick}
                    isCheckingMatch={isCheckingMatch}
                  />
                </div>
                <MemoryProgressIndicator 
                  matchedPairs={matchedPairs.length} 
                  totalPairs={totalPairs} 
                />
              </>
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="text-center p-10 border rounded-lg">
                <p className="text-muted-foreground">
                  Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4">
            <div className="w-full max-w-4xl mx-auto">
              {isLoading && (
                <div className="text-lg text-muted-foreground">Nalaganje igre...</div>
              )}
              
              {error && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                  <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                  <p className="text-sm text-red-500">Poskusite znova later.</p>
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
                <>
                  <div className="my-[160px]">
                    <MemoryGrid 
                      cards={cards} 
                      onCardClick={handleCardClick}
                      isCheckingMatch={isCheckingMatch}
                    />
                  </div>
                  <MemoryProgressIndicator 
                    matchedPairs={matchedPairs.length} 
                    totalPairs={totalPairs} 
                  />
                </>
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
        )}
      </div>

      {/* Floating menu button - Now available on all devices */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20"
          >
            <Home className="w-11 h-11" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="top" 
          align="start" 
          className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]"
          sideOffset={8}
        >
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="gap-2 w-full h-11 text-base justify-start"
              onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Nazaj
            </Button>
            
            <Button
              onClick={() => {
                handleReset();
                setMenuOpen(false);
              }}
              className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start"
            >
              <RotateCcw className="w-5 h-5" />
              Nova igra
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setShowInfo(true);
                setMenuOpen(false);
              }}
              className="gap-2 w-full h-11 text-base justify-start"
            >
              <BookOpen className="w-5 h-5" />
              Navodila
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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

      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={() => navigate("/govorne-igre/spomin")}
      >
        <div />
      </MemoryExitConfirmationDialog>
    </div>
  );
}