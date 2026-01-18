import { useMemo, useState, useEffect } from "react";
import { MemoryCard } from "@/components/games/MemoryCard";
import { MemoryCard as MemoryCardType } from "@/hooks/useMemoryGame";
import { cn } from "@/lib/utils";

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  isCheckingMatch: boolean;
  isLandscape?: boolean;
}

export function MemoryGrid({ 
  cards, 
  onCardClick, 
  isCheckingMatch, 
  isLandscape = false
}: MemoryGridProps) {
  const cardCount = cards.length;
  
  // Internal window size measurement (like MazeGame)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Named function for proper cleanup - IDENTICAL pattern to LabirintC
    const handleOrientationChange = () => setTimeout(updateSize, 100);
    
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  // In landscape mode: 5 columns x 4 rows for better horizontal layout
  // In portrait/desktop mode: 4 columns x 5 rows
  const columns = isLandscape ? 5 : (cardCount <= 16 ? 4 : 5);
  const rows = Math.ceil(cardCount / columns);
  
  const gap = 8; // gap-2 = 8px
  
  // Calculate card size dynamically based on actual window dimensions (like MazeGame)
  const cardSize = useMemo(() => {
    if (!isLandscape || containerSize.width === 0 || containerSize.height === 0) {
      return null;
    }
    
    const PADDING = 4; // minimal padding
    
    const availableWidth = containerSize.width - PADDING * 2;
    const availableHeight = containerSize.height - PADDING * 2;
    
    const sizeByWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns);
    const sizeByHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows);
    
    // Use the smaller dimension to ensure cards fit, with slight reduction for safety
    return Math.floor(Math.min(sizeByWidth, sizeByHeight) * 0.98);
  }, [containerSize, columns, rows, isLandscape, gap]);
  
  // Calculate explicit grid dimensions (like canvas width/height in MazeGame)
  const gridWidth = cardSize ? columns * cardSize + gap * (columns - 1) : 0;
  const gridHeight = cardSize ? rows * cardSize + gap * (rows - 1) : 0;
  
  // Don't render until we have proper dimensions in landscape mode
  if (isLandscape && !cardSize) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        isLandscape && "w-full h-full flex items-center justify-center"
      )}
      style={{ touchAction: 'none' }}
    >
      <div 
        className={cn(
          "grid gap-2",
          !isLandscape && "mx-auto w-full md:gap-3 px-4 md:px-0"
        )}
        style={isLandscape && cardSize ? {
          gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cardSize}px)`,
          width: gridWidth,
          height: gridHeight,
          touchAction: 'none',
        } : {
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          maxWidth: '900px',
          width: '100%',
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
            } : undefined}
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
