
import { useState, useCallback } from 'react';

interface GameState {
  tiles: number[];
  moves: number;
  isPlaying: boolean;
  isWon: boolean;
}

export const useSlidePuzzleGame = (size: number) => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    moves: 0,
    isPlaying: false,
    isWon: false
  });
  const [moveHistory, setMoveHistory] = useState<number[][]>([]);

  const createSolvedPuzzle = useCallback((size: number): number[] => {
    const tiles = Array.from({ length: size * size }, (_, i) => i + 1);
    tiles[size * size - 1] = 0; // Empty space at the end
    return tiles;
  }, []);

  const shufflePuzzle = useCallback((tiles: number[]): number[] => {
    const shuffled = [...tiles];
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const possibleMoves = [];
      const row = Math.floor(emptyIndex / size);
      const col = emptyIndex % size;

      if (row > 0) possibleMoves.push(emptyIndex - size); // Up
      if (row < size - 1) possibleMoves.push(emptyIndex + size); // Down
      if (col > 0) possibleMoves.push(emptyIndex - 1); // Left
      if (col < size - 1) possibleMoves.push(emptyIndex + 1); // Right

      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
      }
    }
    return shuffled;
  }, [size]);

  const checkWin = useCallback((tiles: number[]): boolean => {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[tiles.length - 1] === 0;
  }, []);

  const initializePuzzle = useCallback(() => {
    const solvedTiles = createSolvedPuzzle(size);
    const shuffledTiles = shufflePuzzle(solvedTiles);
    
    setGameState({
      tiles: shuffledTiles,
      moves: 0,
      isPlaying: true,
      isWon: false
    });
    setMoveHistory([]);
  }, [size, createSolvedPuzzle, shufflePuzzle]);

  const handleTileClick = useCallback((index: number) => {
    setGameState(prev => {
      if (prev.isWon) return prev;

      const emptyIndex = prev.tiles.indexOf(0);
      const row = Math.floor(index / size);
      const col = index % size;
      const emptyRow = Math.floor(emptyIndex / size);
      const emptyCol = emptyIndex % size;

      // Check if the clicked tile is adjacent to the empty space
      const isAdjacent = 
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

      if (!isAdjacent) return prev;

      const newTiles = [...prev.tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      
      const isWon = checkWin(newTiles);
      const newMoves = prev.moves + 1;

      // Save move to history
      setMoveHistory(history => [...history, [...prev.tiles]]);

      return {
        tiles: newTiles,
        moves: newMoves,
        isPlaying: !isWon,
        isWon
      };
    });
  }, [size, checkWin]);

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return;

    const previousState = moveHistory[moveHistory.length - 1];
    setGameState(prev => ({
      tiles: [...previousState],
      moves: Math.max(0, prev.moves - 1),
      isPlaying: true,
      isWon: false
    }));
    setMoveHistory(history => history.slice(0, -1));
  }, [moveHistory]);

  const handleHint = useCallback(() => {
    // Simple hint: highlight a tile that can be moved
    setGameState(prev => {
      if (prev.isWon) return prev;

      const emptyIndex = prev.tiles.indexOf(0);
      const row = Math.floor(emptyIndex / size);
      const col = emptyIndex % size;

      // Find adjacent tiles that can be moved
      const possibleMoves = [];
      if (row > 0) possibleMoves.push(emptyIndex - size);
      if (row < size - 1) possibleMoves.push(emptyIndex + size);
      if (col > 0) possibleMoves.push(emptyIndex - 1);
      if (col < size - 1) possibleMoves.push(emptyIndex + 1);

      if (possibleMoves.length > 0) {
        // For now, just console log the hint
        const hintIndex = possibleMoves[0];
        console.log(`Hint: You can move tile ${prev.tiles[hintIndex]} at position ${hintIndex}`);
      }

      return prev;
    });
  }, [size]);

  // Initialize puzzle when size changes
  useState(() => {
    if (gameState.tiles.length === 0) {
      initializePuzzle();
    }
  });

  return {
    gameState,
    moveHistory,
    handleTileClick,
    handleUndo,
    handleHint,
    initializePuzzle
  };
};
