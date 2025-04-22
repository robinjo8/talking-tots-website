import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { MemoryCard } from "./MemoryCard";

export function MemoryGame() {
  const { cards, matchedPairs, totalPairs, handleCardClick, initializeGame } = useMemoryGame();
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          Najdenih parov: {matchedPairs} / {totalPairs}
        </div>
        <Button 
          variant="outline" 
          onClick={initializeGame}
          className="bg-dragon-green/10 border-dragon-green/30 text-dragon-green hover:bg-dragon-green/20"
        >
          Nova igra
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
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
    </div>
  );
}
