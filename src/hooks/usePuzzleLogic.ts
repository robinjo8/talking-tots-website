
import { useState, useEffect, useCallback } from 'react';
import { useAdaptiveDifficulty } from './useAdaptiveDifficulty';

export interface PuzzlePiece {
  id: string;
  correctPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  isPlacedCorrectly: boolean;
  isInAssemblyArea: boolean;
  isInStorageArea: boolean;
  imageSection: string; // URL or data for this piece's image
  shape: 'square' | 'edge' | 'corner';
}

export interface GameState {
  pieces: PuzzlePiece[];
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
  moveCount: number;
}

export const usePuzzleLogic = (imageUrl?: string) => {
  const { difficultyConfig } = useAdaptiveDifficulty();
  const [gameState, setGameState] = useState<GameState>({
    pieces: [],
    isCompleted: false,
    startTime: null,
    endTime: null,
    moveCount: 0
  });

  // Generate puzzle pieces based on difficulty
  const generatePuzzlePieces = useCallback((): PuzzlePiece[] => {
    const { pieceCount, gridSize } = difficultyConfig;
    const pieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      const row = Math.floor(i / gridSize.cols);
      const col = i % gridSize.cols;
      
      // Determine piece shape
      let shape: 'square' | 'edge' | 'corner' = 'square';
      if ((row === 0 || row === gridSize.rows - 1) && (col === 0 || col === gridSize.cols - 1)) {
        shape = 'corner';
      } else if (row === 0 || row === gridSize.rows - 1 || col === 0 || col === gridSize.cols - 1) {
        shape = 'edge';
      }

      pieces.push({
        id: `piece-${i}`,
        correctPosition: { x: col * 60, y: row * 60 }, // 60px per piece
        currentPosition: { 
          x: Math.random() * 600 + 100, 
          y: Math.random() * 400 + 100 
        },
        isPlacedCorrectly: false,
        isInAssemblyArea: false,
        isInStorageArea: false,
        imageSection: imageUrl || `/placeholder-piece-${i}.jpg`,
        shape
      });
    }
    
    return pieces;
  }, [difficultyConfig, imageUrl]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const pieces = generatePuzzlePieces();
    setGameState({
      pieces,
      isCompleted: false,
      startTime: new Date(),
      endTime: null,
      moveCount: 0
    });
  }, [generatePuzzlePieces]);

  // Move piece
  const movePiece = useCallback((pieceId: string, newPosition: { x: number; y: number }, area: 'assembly' | 'storage' | 'scattered') => {
    setGameState(prev => {
      const updatedPieces = prev.pieces.map(piece => {
        if (piece.id === pieceId) {
          const isInAssemblyArea = area === 'assembly';
          const isInStorageArea = area === 'storage';
          
          // Check if piece is placed correctly (within tolerance)
          const tolerance = 30;
          const isPlacedCorrectly = isInAssemblyArea && 
            Math.abs(newPosition.x - piece.correctPosition.x) < tolerance &&
            Math.abs(newPosition.y - piece.correctPosition.y) < tolerance;

          return {
            ...piece,
            currentPosition: newPosition,
            isInAssemblyArea,
            isInStorageArea,
            isPlacedCorrectly
          };
        }
        return piece;
      });

      // Check if puzzle is completed
      const correctlyPlacedCount = updatedPieces.filter(p => p.isPlacedCorrectly).length;
      const isCompleted = correctlyPlacedCount === updatedPieces.length;

      return {
        ...prev,
        pieces: updatedPieces,
        isCompleted,
        endTime: isCompleted ? new Date() : null,
        moveCount: prev.moveCount + 1
      };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Get game statistics
  const getGameStats = useCallback(() => {
    const { startTime, endTime, moveCount } = gameState;
    const duration = startTime && endTime ? 
      Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    
    const correctPieces = gameState.pieces.filter(p => p.isPlacedCorrectly).length;
    const totalPieces = gameState.pieces.length;
    const completionPercentage = totalPieces > 0 ? Math.round((correctPieces / totalPieces) * 100) : 0;

    return {
      duration,
      moveCount,
      completionPercentage,
      correctPieces,
      totalPieces
    };
  }, [gameState]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameState,
    movePiece,
    resetGame,
    getGameStats,
    difficultyConfig
  };
};
