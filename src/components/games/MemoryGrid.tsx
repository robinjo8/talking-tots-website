
import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
}

export function MemoryGrid({ cards, onCardClick, isCheckingMatch }: MemoryGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 md:gap-4 w-full">
      {cards.map((card, index) => (
        <div 
          key={card.uniqueId || `${card.id}-${index}`} 
          className={cn(
            "aspect-square",
            "transform transition-transform duration-200",
            "hover:scale-[1.02]"
          )}
        >
          <MemoryCard
            id={card.id}
            imageUrl={card.image_url}
            audioUrl={card.audio_url}
            flipped={card.flipped}
            matched={card.matched}
            onClick={() => onCardClick(index)}
            disabled={isCheckingMatch}
          />
        </div>
      ))}
    </div>
  );
}
