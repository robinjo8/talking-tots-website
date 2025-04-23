
import { Card } from "@/components/ui/card";
import { MemoryCard } from "./MemoryCard";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function MemoryGrid() {
  const { cards, loading, error, flipCard, resetGame } = useMemoryGame();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={resetGame}>Poskusi znova</Button>
      </div>
    );
  }

  const allCardsMatched = cards.every(card => card.isMatched);

  return (
    <div className="space-y-4">
      <Card className="w-full p-4 bg-white/50 backdrop-blur-sm border-dragon-green/20">
        <div className="grid grid-cols-5 gap-3 aspect-[5/4]">
          {cards.map((card, index) => (
            <MemoryCard 
              key={`${card.id}-${card.pairId}-${index}`}
              index={index}
              imageUrl={card.image_url}
              audioUrl={card.audio_url}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => flipCard(card)}
            />
          ))}
        </div>
      </Card>
      
      {allCardsMatched && (
        <div className="text-center">
          <p className="text-xl font-bold text-dragon-green mb-4">
            Čestitke! Našli ste vse pare!
          </p>
          <Button onClick={resetGame} className="bg-dragon-green hover:bg-dragon-green/90">
            Nova igra
          </Button>
        </div>
      )}
    </div>
  );
}
