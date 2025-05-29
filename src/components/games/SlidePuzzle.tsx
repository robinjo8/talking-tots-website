
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GameBoard from './slide-puzzle/GameBoard';
import GameControls from './slide-puzzle/GameControls';
import GameStats from './slide-puzzle/GameStats';
import WinMessage from './slide-puzzle/WinMessage';
import InstructionsDialog from './slide-puzzle/InstructionsDialog';
import { useSlidePuzzleGame } from '@/hooks/useSlidePuzzleGame';

interface SlidePuzzleProps {
  className?: string;
}

const SlidePuzzle: React.FC<SlidePuzzleProps> = ({ className }) => {
  const [size, setSize] = useState<number>(3);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const {
    gameState,
    moveHistory,
    bestTimes,
    initializePuzzle,
    handleTileClick,
    handleUndo,
    handleHint
  } = useSlidePuzzleGame(size);

  const isNewRecord = gameState.isWon && bestTimes[size] === gameState.time;

  return (
    <div className={cn("h-full w-full flex flex-col overflow-hidden bg-gray-50", className)}>
      {/* Top Controls Bar - Responsive padding and text sizes */}
      <div className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-2 bg-white border-b">
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
        
        {/* Stats Bar - Responsive layout */}
        <div className="flex justify-center mt-1 sm:mt-2">
          <GameStats
            time={gameState.time}
            moves={gameState.moves}
            bestTime={bestTimes[size]}
          />
        </div>
      </div>

      {/* Game Board Container - Updated responsive sizing to ensure full visibility */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0">
        <div className="w-full h-full max-w-[min(90vw,75vh)] max-h-[min(90vw,75vh)] aspect-square">
          <GameBoard
            tiles={gameState.tiles}
            size={size}
            isWon={gameState.isWon}
            onTileClick={handleTileClick}
          />
        </div>
      </div>

      {/* Win Message - Responsive positioning */}
      {gameState.isWon && (
        <div className="flex-shrink-0 px-2 sm:px-4">
          <WinMessage
            moves={gameState.moves}
            time={gameState.time}
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
