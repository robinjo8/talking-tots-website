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
  
  if (isLandscape) {
    // Mobile landscape: use CSS Grid that fills the entire viewport
    return (
      <div 
        className="w-full h-full p-2 box-border"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '8px',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        {cards.map((card, index) => (
          <div 
            key={card.uniqueId || `${card.id}-${index}`} 
            className="w-full h-full min-w-0 min-h-0"
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
  
  // Desktop/portrait mode
  const rows = Math.ceil(cardCount / columns);
  
  return (
    <div 
      className="grid gap-2 md:gap-3 w-full mx-auto"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: '900px',
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
