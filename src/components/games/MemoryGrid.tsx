
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
    <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full max-w-full">
        {cards.map((card, index) => (
          <div 
            key={card.uniqueId || `${card.id}-${index}`} 
            className={cn(
              "aspect-square max-w-full",
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
    </div>
  );
}
