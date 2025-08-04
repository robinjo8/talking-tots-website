import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameZ } from "@/hooks/useMemoryGameZ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryGameTestControls } from "@/components/games/MemoryGameTestControls";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIOSFullscreen } from "@/hooks/useIOSFullscreen";

export default function SpominZ() {
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
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'z').toUpperCase();
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
  } = useMemoryGameZ();
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

  // Enable iOS-optimized fullscreen on mobile devices
  useIOSFullscreen(effectiveFullscreen);

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

  if (effectiveFullscreen) {
    return (
      <div className="ios-game-container overflow-hidden select-none">
        <div className="h-full flex flex-col">
          <div className="bg-background p-3 flex-shrink-0 border-b">
            <div className="flex justify-center gap-3">
              <Button onClick={handleReset} size="sm" variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button variant="outline" onClick={() => setShowInfo(true)} size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
              <Button variant="outline" onClick={() => navigate("/govorne-igre/spomin")} size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-muted/30">
            {isLoading && (
              <div className="h-full flex items-center justify-center text-lg text-muted-foreground">Nalaganje igre...</div>
            )}
            
            {error && (
              <div className="h-full flex items-center justify-center p-6">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                  <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                  <p className="text-sm text-red-500">Poskusite znova později.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                  >
                    Poskusi znova
                  </Button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && cards.length > 0 && (
              <div className="w-full h-full flex items-center justify-center p-6">
                <div className="w-full bg-background rounded-lg shadow-sm border p-6 flex items-center justify-center">
                  <MemoryGrid 
                    cards={cards} 
                    onCardClick={handleCardClick}
                    isCheckingMatch={isCheckingMatch}
                  />
                </div>
              </div>
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-10 border rounded-lg bg-background">
                  <p className="text-muted-foreground">
                    Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-background">
        <div className="bg-background p-4 border-b">
          <div className="flex justify-center gap-4">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            <Button onClick={() => setShowInfo(true)} variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Navodila
            </Button>
            <Button onClick={() => navigate("/govorne-igre/spomin")} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
          </div>
        </div>
        
        <div className="w-full flex justify-center items-center p-4">
          <div className="w-full max-w-4xl bg-muted/30 rounded-lg p-6 min-h-[500px] flex items-center justify-center">
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
              <div className="w-full bg-background rounded-lg shadow-sm border p-6 flex items-center justify-center">
                <MemoryGrid 
                  cards={cards} 
                  onCardClick={handleCardClick}
                  isCheckingMatch={isCheckingMatch}
                />
              </div>
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="text-center p-10 border rounded-lg bg-background">
                <p className="text-muted-foreground">
                  Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {cards.length > 0 && (
          <div className="text-center pb-6 text-sm">
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