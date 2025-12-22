import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
  isLandscape?: boolean;
}

export function MemoryGrid({ cards, onCardClick, isCheckingMatch, isLandscape = false }: MemoryGridProps) {
  const cardCount = cards.length;
  
  // In landscape mode: 5 columns x 4 rows for better horizontal layout
  // In portrait/desktop mode: 4 columns x 5 rows
  const columns = isLandscape ? 5 : (cardCount <= 16 ? 4 : 5);
  const rows = Math.ceil(cardCount / columns);
  
  return (
    <div 
      className={cn(
        "grid gap-2 md:gap-3 w-full mx-auto",
        isLandscape && "h-full"
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: isLandscape ? '100%' : '900px',
        // In landscape, fill entire viewport
        ...(isLandscape && {
          height: '100%',
        })
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
            // In landscape: fill available space evenly
            // In portrait/desktop: calculate based on row count
            maxHeight: isLandscape 
              ? 'calc(100vh / 4.2)' 
              : `calc((100vh - 120px) / ${rows})`,
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
