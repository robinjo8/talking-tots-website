import { useRef, useEffect } from 'react';
import { MatchingGameImage } from '@/data/matchingGameData';
import { useMatchingGame } from '@/hooks/useMatchingGame';
import { ImageTile } from './ImageTile';
import { ConnectionLine } from './ConnectionLine';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchingGameProps {
  images: MatchingGameImage[];
  numColumns?: number;
  onGameComplete?: (score: number) => void;
  className?: string;
}

export function MatchingGame({ 
  images, 
  numColumns = 2, 
  onGameComplete,
  className 
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
      onGameComplete(gameState.score);
    }
  }, [gameState.isComplete, gameState.score, onGameComplete]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Ni slik za prikaz</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex justify-center", className)}>
      {/* Game area */}
      <div 
        ref={containerRef}
        className="relative rounded-xl p-6 w-full max-w-4xl"
      >
        <ConnectionLine connections={gameState.connections} containerRef={containerRef} />
        
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
          {/* All columns are now shuffled */}
          {gameState.shuffledColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {column.map((image, index) => (
                  <ImageTile
                    key={`column-${columnIndex}-${image.word}-${index}`}
                    image={image}
                    isSelected={isTileSelected(image.word, columnIndex, index)}
                    isMatched={isTileMatched(image.word)}
                    onClick={() => handleTileClick(image.word, columnIndex, index)}
                    className="mx-auto w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
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