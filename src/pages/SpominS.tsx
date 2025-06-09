
import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameS } from "@/hooks/useMemoryGameS";
import { toast } from "@/components/ui/sonner";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";

export default function SpominS() {
  const navigate = useNavigate();
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
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
  } = useMemoryGameS();
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
    toast.success("Igra je bila ponovno nastavljena!");
  };

  useEffect(() => {
    if (gameCompleted && gameStartTimeRef.current && gameTime === null) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - gameStartTimeRef.current) / 1000);
      setGameTime(timeTaken);
      
      setTimeout(() => {
        toast.success(`Čestitamo! Igra je končana v ${timeTaken} sekundah!`, {
          duration: 5000
        });
      }, 500);
    }
  }, [gameCompleted, gameStartTimeRef, gameTime]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - hidden on mobile for full-screen experience */}
      <div className="hidden md:block">
        <Header />
      </div>
      <audio ref={audioRef} className="hidden" />
      
      <div className="h-screen md:h-auto md:min-h-screen flex flex-col">
        <div className="container max-w-7xl mx-auto h-full md:h-auto md:pt-28 pt-4 pb-4 md:pb-20 px-4 flex flex-col">
          {/* Header section with controls */}
          <div className="flex items-center justify-between gap-3 mb-4 md:mb-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                onClick={() => navigate("/govorne-igre")}
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
                Spomin (besede na črko S)
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(true)}
                className="h-8 w-8 p-0"
              >
                <Info className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nova igra</span>
              </Button>
            </div>
          </div>
          
          {/* Progress card */}
          <Card className="bg-dragon-green/5 mb-4 md:mb-6 flex-shrink-0">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold">Igra spomin</h2>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Najdeni pari: </span>
                    <span className="text-dragon-green font-bold">{matchedPairs.length}</span>
                    <span className="text-muted-foreground"> od {totalPairs}</span>
                  </div>
                  
                  {gameCompleted && gameTime !== null && (
                    <div className="bg-dragon-green/10 text-dragon-green px-3 py-1 rounded-md text-sm font-medium">
                      Čas: {gameTime} sekund
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game content - takes remaining space */}
          <div className="flex-1 flex justify-center items-center min-h-0">
            <div className="w-full max-w-4xl h-full flex items-center justify-center">
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
      </div>

      <InfoModal 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Kako igrati spomin"
        content="Obračaj kartice in najdi pare. Ko obrneš kartico, boš slišal/a besedo in videl/a sliko. Ko najdeš vse pare, si uspešno zaključil/a igro!"
      />
    </div>
  );
}
