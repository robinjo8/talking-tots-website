
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSlidePuzzleGame } from './slide-puzzle/useSlidePuzzleGame';
import { useSlidePuzzleTimer } from './slide-puzzle/useSlidePuzzleTimer';
import { useSlidePuzzleBestTimes } from './slide-puzzle/useSlidePuzzleBestTimes';
import GameBoard from './slide-puzzle/GameBoard';
import GameControls from './slide-puzzle/GameControls';
import GameStats from './slide-puzzle/GameStats';
import WinMessage from './slide-puzzle/WinMessage';
import InstructionsDialog from './slide-puzzle/InstructionsDialog';

interface SlidePuzzleProps {
  className?: string;
}

const SlidePuzzle: React.FC<SlidePuzzleProps> = ({ className }) => {
  const [size, setSize] = useState<number>(4);
  const [showInstructions, setShowInstructions] = useState(false);

  const { gameState, moveHistory, handleTileClick, handleUndo, handleHint, initializePuzzle } = useSlidePuzzleGame(size);
  const { time } = useSlidePuzzleTimer(gameState.isPlaying, gameState.isWon);
  const { bestTimes, saveBestTime } = useSlidePuzzleBestTimes();

  // Save best time when game is won
  useEffect(() => {
    if (gameState.isWon && time > 0) {
      saveBestTime(size, time);
    }
  }, [gameState.isWon, time, size, saveBestTime]);

  const isNewRecord = gameState.isWon && bestTimes[size] === time;

  return (
    <div className={cn("h-full w-full flex flex-col", className)}>
      {/* Header Controls */}
      <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm rounded-lg mb-3 p-3">
        <GameControls
          size={size}
          canUndo={moveHistory.length > 0}
          isWon={gameState.isWon}
          onSizeChange={setSize}
          onUndo={handleUndo}
          onHint={handleHint}
          onShowInstructions={() => setShowInstructions(true)}
          onNewGame={initializePuzzle}
        />
        
        {/* Game Stats */}
        <div className="flex justify-center mt-3">
          <GameStats
            time={time}
            moves={gameState.moves}
            bestTime={bestTimes[size]}
          />
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-[min(85vw,85vh,500px)] aspect-square">
          <GameBoard
            tiles={gameState.tiles}
            size={size}
            isWon={gameState.isWon}
            onTileClick={handleTileClick}
          />
        </div>
      </div>

      {/* Win Message */}
      {gameState.isWon && (
        <div className="flex-shrink-0 mt-3">
          <WinMessage
            moves={gameState.moves}
            time={time}
            isNewRecord={isNewRecord}
          />
        </div>
      )}

      {/* Instructions Dialog */}
      <InstructionsDialog
        isOpen={showInstructions}
        onOpenChange={setShowInstructions}
        size={size}
      />
    </div>
  );
};

export default SlidePuzzle;
