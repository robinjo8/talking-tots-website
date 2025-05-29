import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GameBoard from './slide-puzzle/GameBoard';
import GameControls from './slide-puzzle/GameControls';
import GameStats from './slide-puzzle/GameStats';
import WinMessage from './slide-puzzle/WinMessage';
import InstructionsDialog from './slide-puzzle/InstructionsDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useSlidePuzzleGame } from '@/hooks/useSlidePuzzleGame';
interface SlidePuzzleProps {
  className?: string;
}
const SlidePuzzle: React.FC<SlidePuzzleProps> = ({
  className
}) => {
  const [size, setSize] = useState<number>(3);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
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

  // Navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState.isPlaying && !gameState.isWon) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handlePopState = (e: PopStateEvent) => {
      if (gameState.isPlaying && !gameState.isWon) {
        e.preventDefault();
        setShowExitConfirm(true);
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push initial state to handle back button
    if (gameState.isPlaying && !gameState.isWon) {
      window.history.pushState(null, '', window.location.pathname);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameState.isPlaying, gameState.isWon]);
  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    window.history.back();
  };
  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };
  return <div className={cn("h-full w-full flex flex-col bg-gray-50 min-h-0", className)}>
      {/* Controls Section - Always visible at top with better spacing */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-[33px] my-[10px]">
          <GameControls size={size} canUndo={moveHistory.length > 0} isWon={gameState.isWon} onSizeChange={setSize} onUndo={handleUndo} onHint={handleHint} onShowInstructions={() => setShowInstructions(true)} onNewGame={initializePuzzle} />
        </div>
        
        {/* Stats Section - Always visible */}
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3">
          <GameStats time={gameState.time} moves={gameState.moves} bestTime={bestTimes[size]} />
        </div>
      </div>

      {/* Game Board Container - Adaptive sizing with better constraints */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0 py-[9px] my-0">
        <div className="w-full h-full flex items-center justify-center max-w-4xl mx-auto">
          <div className="aspect-square w-full" style={{
          maxWidth: `min(100%, calc(100vh - 200px), ${size === 3 ? '400px' : size === 4 ? '450px' : '500px'})`,
          maxHeight: `min(100%, calc(100vh - 200px), ${size === 3 ? '400px' : size === 4 ? '450px' : '500px'})`
        }}>
            <GameBoard tiles={gameState.tiles} size={size} isWon={gameState.isWon} onTileClick={handleTileClick} />
          </div>
        </div>
      </div>

      {/* Win Message - Positioned at bottom when game is won */}
      {gameState.isWon && <div className="flex-shrink-0 w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3">
          <WinMessage moves={gameState.moves} time={gameState.time} isNewRecord={isNewRecord} />
        </div>}

      {/* Dialogs */}
      <InstructionsDialog isOpen={showInstructions} onOpenChange={setShowInstructions} size={size} />

      <ConfirmDialog open={showExitConfirm} onOpenChange={setShowExitConfirm} title="Zapusti igro" description="Ali res želite zapustiti igro?" confirmText="Da" cancelText="Ne" onConfirm={handleConfirmExit} onCancel={handleCancelExit} />
    </div>;
};
export default SlidePuzzle;