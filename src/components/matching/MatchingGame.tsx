import { useRef, useEffect } from 'react';
import { MatchingGameImage } from '@/data/matchingGameData';
import { useMatchingGame } from '@/hooks/useMatchingGame';
import { ImageTile } from './ImageTile';
import { ConnectionLine } from './ConnectionLine';
import { Trophy } from 'lucide-react';
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

  // Dynamic tile sizing based on landscape mode - EXACTLY matching FourColumnGame sizing
  const tileClass = isLandscape 
    ? "w-14 h-14 sm:w-16 sm:h-16" 
    : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44";

  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)}>
      {/* Game area */}
      <div 
        ref={containerRef}
        className={cn(
          "relative rounded-xl",
          isLandscape ? "w-full max-w-4xl p-1" : "p-4 md:p-6 lg:p-8"
        )}
      >
        <ConnectionLine connections={gameState.connections} containerRef={containerRef} />
        
        <div 
          className={cn("grid justify-items-center", isLandscape ? "gap-1" : "gap-2 sm:gap-3 md:gap-6 lg:gap-8 xl:gap-10")} 
          style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
        >
          {/* All columns are now shuffled */}
          {gameState.shuffledColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className={cn("flex flex-col", isLandscape ? "gap-1" : "gap-1 sm:gap-2 md:gap-4")}>
              <div className={cn("flex flex-col", isLandscape ? "gap-2" : "gap-4")}>
                {column.map((image, index) => (
                  <ImageTile
                    key={`column-${columnIndex}-${image.word}-${index}`}
                    image={image}
                    isSelected={isTileSelected(image.word, columnIndex, index)}
                    isMatched={isTileMatched(image.word)}
                    onClick={() => handleTileClick(image.word, columnIndex, index)}
                    className={tileClass}
                    data-image-id={image.word}
                    data-column={columnIndex}
                    data-index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Game completion indicator */}
        {gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-dragon-green font-bold text-lg">
              <Trophy className="h-6 w-6" />
              <span>Uspešno dokončano!</span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {!gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className="w-full bg-muted rounded-full h-2">
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