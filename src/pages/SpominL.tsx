import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameL } from "@/hooks/useMemoryGameL";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SpominL() {
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
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'l').toUpperCase();
  const { 
    cards, 
    isLoading, 
    error, 
    flipCard, 
    resetGame, 
    gameCompleted,
    matchedPairs,
    totalPairs,
    isCheckingMatch
  } = useMemoryGameL();
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

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}>
      {!effectiveFullscreen && <Header />}
      
      <div className={`${effectiveFullscreen ? 'h-full flex flex-col' : 'container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-2 sm:px-4'}`}>
        
        <Card className={`bg-dragon-green/5 ${effectiveFullscreen ? 'mx-2 mt-2 mb-1' : 'mb-4 md:mb-6'} flex-shrink-0`}>
          <CardContent className={`${effectiveFullscreen ? 'p-3' : 'p-4 md:p-6'}`}>
            <div className="space-y-3">
              <div>
                <h2 className={`${effectiveFullscreen ? 'text-base' : 'text-lg md:text-xl'} font-bold mb-2`}>Igra spomin za črko {currentLetter}</h2>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">Najdeni pari: </span>
                    <span className="text-dragon-green font-bold">{matchedPairs.length}</span>
                    <span className="text-muted-foreground"> od {totalPairs}</span>
                    {gameCompleted && gameTime !== null && (
                      <span className="ml-3 bg-dragon-green/10 text-dragon-green px-2 py-1 rounded-md text-xs font-medium">
                        Čas: {gameTime}s
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0">
                    {effectiveFullscreen ? (
                      <>
                        <Button
                          onClick={handleReset}
                          size="sm"
                          className="bg-dragon-green hover:bg-dragon-green/90 text-white p-1.5 h-8 w-8"
                          variant="default"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate("/govorne-igre/spomin")}
                          size="sm"
                          className="p-1.5 h-8 w-8"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setShowInfo(true)}
                          size="sm"
                          className="p-1.5 h-8 w-8"
                        >
                          <BookOpen className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate("/govorne-igre/spomin/spomin-l")}
                          size="sm"
                          className="p-1.5 h-8 w-8"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleReset}
                          className="gap-2 bg-dragon-green hover:bg-dragon-green/90 text-white"
                          variant="default"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Nova igra
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate("/govorne-igre/spomin")}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Nazaj
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setShowInfo(true)}
                          className="gap-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          Navodila
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className={`transition-opacity duration-500 w-full h-full flex items-center justify-center ${cards.length ? 'opacity-100' : 'opacity-0'}`}>
                <MemoryGrid 
                  cards={cards} 
                  onCardClick={handleCardClick}
                  isCheckingMatch={isCheckingMatch}
                />
              </div>
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
    </div>
  );
}