import { useRef, useEffect } from 'react';
import { MatchingGameImage } from '@/data/matchingGameData';
import { useMatchingGame } from '@/hooks/useMatchingGame';
import { useDynamicTileSize } from '@/hooks/useDynamicTileSize';
import { ImageTile } from './ImageTile';
import { ConnectionLine } from './ConnectionLine';

import { cn } from '@/lib/utils';

interface MatchingGameProps {
  images: MatchingGameImage[];
  numColumns?: number;
  onGameComplete?: (score: number, playedImages: MatchingGameImage[]) => void;
  className?: string;
  isLandscape?: boolean;
}

export function MatchingGame({ 
  images, 
  numColumns = 2, 
  onGameComplete,
  className,
  isLandscape = false
}: MatchingGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    gameState,
    handleTileClick,
    resetGame,
    isTileSelected,
    isTileMatched
  } = useMatchingGame(images, numColumns);

  const numRows = images.length > 0 ? Math.ceil(images.length / numColumns) : 3;
  const tileSize = useDynamicTileSize({
    numColumns,
    numRows,
    isLandscape,
  });

  // Handle game completion
  useEffect(() => {
    if (gameState.isComplete && onGameComplete) {
      onGameComplete(gameState.score, gameState.originalImages);
    }
  }, [gameState.isComplete, gameState.score, gameState.originalImages, onGameComplete]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Ni slik za prikaz</p>
      </div>
    );
  }

  const gapSize = isLandscape ? 4 : 16;

  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)}>
      <div 
        ref={containerRef}
        className={cn(
          "relative rounded-xl",
          isLandscape ? "w-full max-w-4xl p-1" : "p-2"
        )}
      >
        <ConnectionLine connections={gameState.connections} containerRef={containerRef} />
        
        <div 
          className="grid justify-items-center"
          style={{ 
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
            gap: `${gapSize}px`
          }}
        >
          {gameState.shuffledColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="flex flex-col" style={{ gap: `${gapSize}px` }}>
              <div className="flex flex-col" style={{ gap: `${gapSize}px` }}>
                {column.map((image, index) => (
                  <ImageTile
                    key={`column-${columnIndex}-${image.word}-${index}`}
                    image={image}
                    isSelected={isTileSelected(image.word, columnIndex, index)}
                    isMatched={isTileMatched(image.word)}
                    onClick={() => handleTileClick(image.word, columnIndex, index)}
                    style={{ width: tileSize, height: tileSize }}
                    disableScaleEffects={isLandscape}
                    data-image-id={image.word}
                    data-column={columnIndex}
                    data-index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        {!gameState.isComplete && (
          <div className="mt-4 text-center">
            <div className={`bg-white/80 rounded-full h-2 mx-auto ${isLandscape ? 'w-48' : 'w-full bg-muted'}`}>
              <div 
                className="bg-dragon-green h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(gameState.completedMatches.size / gameState.originalImages.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
