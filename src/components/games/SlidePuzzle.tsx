
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import GameBoard from './slide-puzzle/GameBoard';
import GameControls from './slide-puzzle/GameControls';
import GameStats from './slide-puzzle/GameStats';
import WinMessage from './slide-puzzle/WinMessage';
import InstructionsDialog from './slide-puzzle/InstructionsDialog';

interface SlidePuzzleProps {
  className?: string;
}

interface GameState {
  tiles: number[];
  emptyIndex: number;
  moves: number;
  time: number;
  isWon: boolean;
  isPlaying: boolean;
}

interface Move {
  tiles: number[];
  emptyIndex: number;
  moves: number;
}

const SlidePuzzle: React.FC<SlidePuzzleProps> = ({ className }) => {
  const [size, setSize] = useState<number>(3);
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    emptyIndex: 0,
    moves: 0,
    time: 0,
    isWon: false,
    isPlaying: false
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [bestTimes, setBestTimes] = useState<Record<number, number>>({});
  const [showInstructions, setShowInstructions] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying && !gameState.isWon) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isWon]);

  // Load best times from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('slidePuzzleBestTimes');
    if (saved) {
      setBestTimes(JSON.parse(saved));
    }
  }, []);

  // Save best times to localStorage
  const saveBestTime = useCallback((gridSize: number, time: number) => {
    const newBestTimes = { ...bestTimes };
    if (!newBestTimes[gridSize] || time < newBestTimes[gridSize]) {
      newBestTimes[gridSize] = time;
      setBestTimes(newBestTimes);
      localStorage.setItem('slidePuzzleBestTimes', JSON.stringify(newBestTimes));
    }
  }, [bestTimes]);

  const shuffleTiles = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    if (!isSolvable(shuffled)) {
      if (shuffled[0] !== 0 && shuffled[1] !== 0) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      } else if (shuffled[2] !== 0 && shuffled[3] !== 0) {
        [shuffled[2], shuffled[3]] = [shuffled[3], shuffled[2]];
      }
    }
    
    return shuffled;
  };

  const isSolvable = (puzzle: number[]): boolean => {
    let inversions = 0;
    const filtered = puzzle.filter(tile => tile !== 0);
    
    for (let i = 0; i < filtered.length - 1; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        if (filtered[i] > filtered[j]) {
          inversions++;
        }
      }
    }
    
    return inversions % 2 === 0;
  };

  const initializePuzzle = useCallback(() => {
    const totalTiles = size * size;
    const initialTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    initialTiles.push(0);
    
    const shuffled = shuffleTiles([...initialTiles]);
    
    setGameState({
      tiles: shuffled,
      emptyIndex: shuffled.indexOf(0),
      moves: 0,
      time: 0,
      isWon: false,
      isPlaying: false
    });
    setMoveHistory([]);
  }, [size]);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const checkWin = useCallback((tiles: number[]) => {
    if (tiles.length === 0) return false;
    
    return tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === 0;
      return tile === index + 1;
    });
  }, []);

  const handleTileClick = (index: number) => {
    if (gameState.isWon || gameState.tiles[index] === 0) return;

    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(gameState.emptyIndex / size);
    const emptyCol = gameState.emptyIndex % size;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      setMoveHistory(prev => [...prev, {
        tiles: [...gameState.tiles],
        emptyIndex: gameState.emptyIndex,
        moves: gameState.moves
      }]);

      const newTiles = [...gameState.tiles];
      [newTiles[index], newTiles[gameState.emptyIndex]] = [newTiles[gameState.emptyIndex], newTiles[index]];
      
      const newMoves = gameState.moves + 1;
      const isWon = checkWin(newTiles);
      
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        emptyIndex: index,
        moves: newMoves,
        isWon,
        isPlaying: !isWon && (prev.isPlaying || newMoves === 1)
      }));

      if (isWon && gameState.time > 0) {
        saveBestTime(size, gameState.time);
      }
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    setGameState(prev => ({
      ...prev,
      tiles: lastMove.tiles,
      emptyIndex: lastMove.emptyIndex,
      moves: lastMove.moves,
      isWon: false
    }));
    setMoveHistory(prev => prev.slice(0, -1));
  };

  const handleHint = () => {
    if (gameState.isWon) return;
    
    for (let i = 0; i < gameState.tiles.length; i++) {
      const tile = gameState.tiles[i];
      if (tile === 0) continue;
      
      const currentRow = Math.floor(i / size);
      const currentCol = i % size;
      const targetRow = Math.floor((tile - 1) / size);
      const targetCol = (tile - 1) % size;
      
      if (currentRow !== targetRow || currentCol !== targetCol) {
        const emptyRow = Math.floor(gameState.emptyIndex / size);
        const emptyCol = gameState.emptyIndex % size;
        
        const isAdjacent = 
          (Math.abs(currentRow - emptyRow) === 1 && currentCol === emptyCol) ||
          (Math.abs(currentCol - emptyCol) === 1 && currentRow === emptyRow);
        
        if (isAdjacent) {
          const tileElement = document.querySelector(`[data-tile-index="${i}"]`);
          if (tileElement) {
            tileElement.classList.add('animate-pulse', 'ring-2', 'ring-yellow-400');
            setTimeout(() => {
              tileElement.classList.remove('animate-pulse', 'ring-2', 'ring-yellow-400');
            }, 1500);
          }
          break;
        }
      }
    }
  };

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
