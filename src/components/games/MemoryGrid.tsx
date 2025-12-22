import { useMemo } from "react";
import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
  isLandscape?: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

export function MemoryGrid({ 
  cards, 
  onCardClick, 
  isCheckingMatch, 
  isLandscape = false,
  containerWidth,
  containerHeight 
}: MemoryGridProps) {
  const cardCount = cards.length;
  
  // In landscape mode: 5 columns x 4 rows for better horizontal layout
  // In portrait/desktop mode: 4 columns x 5 rows
  const columns = isLandscape ? 5 : (cardCount <= 16 ? 4 : 5);
  const rows = Math.ceil(cardCount / columns);
  
  // Calculate card size dynamically based on actual container dimensions (like MazeGame)
  const cardSize = useMemo(() => {
    if (!isLandscape || !containerWidth || !containerHeight) return null;
    
    const gap = 8; // gap-2 = 8px
    const padding = 16; // some padding
    
    const availableWidth = containerWidth - padding * 2 - gap * (columns - 1);
    const availableHeight = containerHeight - padding * 2 - gap * (rows - 1);
    
    const sizeByWidth = availableWidth / columns;
    const sizeByHeight = availableHeight / rows;
    
    // Use the smaller dimension to ensure cards fit
    return Math.floor(Math.min(sizeByWidth, sizeByHeight));
  }, [isLandscape, containerWidth, containerHeight, columns, rows]);
  
  // Don't render until we have proper dimensions in landscape mode
  if (isLandscape && !cardSize) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "grid gap-2 mx-auto",
        !isLandscape && "w-full md:gap-3"
      )}
      style={isLandscape && cardSize ? {
        gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cardSize}px)`,
        width: 'fit-content',
        height: 'fit-content',
      } : {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: '900px',
      }}
    >
      {cards.map((card, index) => (
        <div 
          key={card.uniqueId || `${card.id}-${index}`} 
          className={cn(
            "transform transition-transform duration-200",
            "hover:scale-[1.02]",
            !isLandscape && "aspect-square"
          )}
          style={isLandscape && cardSize ? {
            width: cardSize,
            height: cardSize,
          } : {
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
