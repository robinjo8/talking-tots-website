
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { MemoryCard } from "./MemoryCard";
import { Loader2 } from "lucide-react";

export function MemoryGame() {
  const { cards, matchedPairs, totalPairs, handleCardClick, initializeGame, audioRef, isLoading } = useMemoryGame();
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <audio ref={audioRef} className="hidden" />
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          Najdenih parov: {matchedPairs} / {totalPairs}
        </div>
        <Button 
          variant="outline" 
          onClick={() => initializeGame()}
          className="bg-dragon-green/10 border-dragon-green/30 text-dragon-green hover:bg-dragon-green/20"
        >
          Nova igra
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 text-dragon-green animate-spin" />
          <span className="ml-4 text-lg">Nalaganje igre...</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 md:gap-4 aspect-[4/5]">
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              word={card.word}
              type={card.type}
              image={card.image}
              isFlipped={card.flipped}
              isMatched={card.matched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
