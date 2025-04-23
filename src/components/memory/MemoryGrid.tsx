
import { Card } from "@/components/ui/card";
import { MemoryCard } from "./MemoryCard";

export function MemoryGrid() {
  // Create 20 unique card slots
  const cards = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    imageUrl: undefined,
    audioUrl: undefined
  }));

  return (
    <Card className="w-full p-4 bg-white/50 backdrop-blur-sm border-dragon-green/20">
      <div className="grid grid-cols-5 gap-3 aspect-[5/4]">
        {cards.map((card) => (
          <MemoryCard 
            key={card.id} 
            index={card.id}
            imageUrl={card.imageUrl}
            audioUrl={card.audioUrl}
          />
        ))}
      </div>
    </Card>
  );
}
