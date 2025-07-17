
import { useState, useEffect, useCallback } from 'react';
import { shuffleTiles, checkWin, canMoveTile } from '../utils/slidePuzzleUtils';
import { useEnhancedProgress } from './useEnhancedProgress';

export interface GameState {
  tiles: number[];
  emptyIndex: number;
  moves: number;
  time: number;
  isWon: boolean;
  isPlaying: boolean;
}

export interface Move {
  tiles: number[];
  emptyIndex: number;
  moves: number;
}

export const useSlidePuzzleGame = (size: number, puzzleType: string = 'general') => {
  const { recordGameCompletion } = useEnhancedProgress();
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

  const handleTileClick = (index: number) => {
    if (gameState.isWon || gameState.tiles[index] === 0) return;

    if (canMoveTile(index, gameState.emptyIndex, size)) {
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
        // Record puzzle completion in progress system
        recordGameCompletion('puzzle', puzzleType);
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
        
        if (canMoveTile(i, gameState.emptyIndex, size)) {
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

  return {
    gameState,
    moveHistory,
    bestTimes,
    initializePuzzle,
    handleTileClick,
    handleUndo,
    handleHint
  };
};
