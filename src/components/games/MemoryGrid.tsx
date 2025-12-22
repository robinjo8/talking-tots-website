
import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
}

export function MemoryGrid({ cards, onCardClick, isCheckingMatch }: MemoryGridProps) {
  // Calculate grid dimensions based on card count
  const cardCount = cards.length;
  const columns = cardCount <= 16 ? 4 : 5;
  const rows = Math.ceil(cardCount / columns);
  
  return (
    <div 
      className="grid gap-2 md:gap-3 w-full mx-auto"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: '900px',
        // Calculate card height to fit in viewport
        // Each card should be square, so we calculate based on available height
      }}
    >
      {cards.map((card, index) => (
        <div 
          key={card.uniqueId || `${card.id}-${index}`} 
          className={cn(
            "aspect-square",
            "transform transition-transform duration-200",
            "hover:scale-[1.02]"
          )}
          style={{
            // Limit max height per card based on viewport and row count
            maxHeight: `calc((100vh - 120px) / ${rows})`,
          }}
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
