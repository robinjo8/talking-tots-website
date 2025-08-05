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
    <div className={cn("w-full max-w-6xl mx-auto p-4", className)}>
      {/* Header with score and reset button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Poveži pare
          </h2>
          {gameState.isComplete && (
            <div className="flex items-center gap-2 text-dragon-green font-bold">
              <Trophy className="h-5 w-5" />
              <span>Uspešno!</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Točke: <span className="font-bold text-foreground">{gameState.score}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
        </div>
      </div>

      {/* Game area */}
      <div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-background to-muted/30 rounded-xl p-6 border-2 border-border"
      >
        <ConnectionLine connections={gameState.connections} containerRef={containerRef} />
        
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
          {/* Original column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-center text-muted-foreground mb-2">
              Originalne slike
            </h3>
            <div className="flex flex-col gap-3">
              {gameState.originalImages.map((image, index) => (
                <ImageTile
                  key={`original-${image.word}-${index}`}
                  image={image}
                  isSelected={isTileSelected(image.word, 0, index)}
                  isMatched={isTileMatched(image.word)}
                  onClick={() => handleTileClick(image.word, 0, index)}
                  className="mx-auto"
                  data-image-id={image.word}
                  data-column="0"
                  data-index={index}
                />
              ))}
            </div>
          </div>

          {/* Shuffled columns */}
          {gameState.shuffledColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex + 1}`} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-center text-muted-foreground mb-2">
                Stolpec {columnIndex + 2}
              </h3>
              <div className="flex flex-col gap-3">
                {column.map((image, index) => (
                  <ImageTile
                    key={`column-${columnIndex + 1}-${image.word}-${index}`}
                    image={image}
                    isSelected={isTileSelected(image.word, columnIndex + 1, index)}
                    isMatched={isTileMatched(image.word)}
                    onClick={() => handleTileClick(image.word, columnIndex + 1, index)}
                    className="mx-auto"
                    data-image-id={image.word}
                    data-column={columnIndex + 1}
                    data-index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 text-center">
          <div className="text-sm text-muted-foreground">
            Ujemanja: {gameState.completedMatches.size} / {gameState.originalImages.length}
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-dragon-green h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(gameState.completedMatches.size / gameState.originalImages.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      {gameState.completedMatches.size === 0 && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Klikni na sliko v prvem stolpcu in nato poišči enako sliko v drugih stolpcih. 
            Ko najdeš pravo ujemanje, se bosta sliki povezali z črto!
          </p>
        </div>
      )}
    </div>
  );
}