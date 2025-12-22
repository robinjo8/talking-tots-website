
import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
}

export function MemoryGrid({ cards, onCardClick, isCheckingMatch }: MemoryGridProps) {
  // Mobile: 4 columns, 5 rows (20 cards) - larger cards centered
  // Desktop: dynamic based on card count, limited height to fit viewport
  const cardCount = cards.length;
  const desktopColumns = cardCount <= 16 ? 4 : 5;
  const desktopRows = Math.ceil(cardCount / desktopColumns);
  
  return (
    <div 
      className={cn(
        "grid grid-cols-4 gap-2 md:gap-3 mx-auto items-center justify-items-center",
        // Mobile: auto-fit width based on card size, centered
        "w-fit md:w-full",
        "md:max-w-[900px]"
      )}
    >
      {cards.map((card, index) => (
        <div 
          key={card.uniqueId || `${card.id}-${index}`} 
          className={cn(
            "aspect-square w-full",
            "transform transition-transform duration-200",
            "hover:scale-[1.02]",
            // Mobile: limit card size for proper display
            "max-w-[72px] sm:max-w-[85px] md:max-w-[140px] lg:max-w-[160px]"
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
