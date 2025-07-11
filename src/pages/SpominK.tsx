import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameK } from "@/hooks/useMemoryGameK";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";

export default function SpominK() {
  const navigate = useNavigate();
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();
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
  } = useMemoryGameK();
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-2 sm:px-4">
        
        <Card className="bg-dragon-green/5 mb-4 md:mb-6 flex-shrink-0">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Igra spomin</h2>
                  <div className="text-sm mt-1">
                    <span className="font-medium">Najdeni pari: </span>
                    <span className="text-dragon-green font-bold">{matchedPairs.length}</span>
                    <span className="text-muted-foreground"> od {totalPairs}</span>
                  </div>
                </div>
                
                {gameCompleted && gameTime !== null && (
                  <div className="bg-dragon-green/10 text-dragon-green px-3 py-1 rounded-md text-sm font-medium">
                    Čas: {gameTime} sekund
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
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
              </div>
            </div>
          </CardContent>
        </Card>

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
