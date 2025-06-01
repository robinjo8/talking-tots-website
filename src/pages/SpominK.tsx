
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameK } from "@/hooks/useMemoryGameK";
import { toast } from "@/components/ui/sonner";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

export default function SpominK() {
  const navigate = useNavigate();
  const { audioRef } = useAudioPlayback();
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
      <Header />
      <audio ref={audioRef} className="hidden" />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
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
            
            <h1 className="text-2xl font-bold text-foreground">
              Spomin (besede na črko K)
            </h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Nova igra
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Obračaj kartice in najdi pare. Ko obrneš kartico, boš slišal/a besedo in videl/a sliko. Ko najdeš vse pare, si uspešno zaključil/a igro!
        </p>
        
        <Card className="bg-dragon-green/5 mb-6">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {isLoading && (
              <div className="h-[60vh] flex items-center justify-center">
                <div className="text-lg text-muted-foreground">Nalaganje igre...</div>
              </div>
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
              <div className={`transition-opacity duration-500 ${cards.length ? 'opacity-100' : 'opacity-0'}`}>
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
  );
}
