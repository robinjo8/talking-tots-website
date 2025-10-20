import { useState, useCallback, useEffect } from 'react';
import { MatchingGameImage } from '@/data/matchingGameData';

export interface MatchPosition {
  imageId: string;
  column: number;
  index: number;
}

export interface Connection {
  from: MatchPosition;
  to: MatchPosition;
  id: string;
}

export interface MatchingGameState {
  originalImages: MatchingGameImage[];
  shuffledColumns: MatchingGameImage[][];
  connections: Connection[];
  selectedPosition: MatchPosition | null;
  completedMatches: Set<string>;
  isComplete: boolean;
  score: number;
  showPairDialog: boolean;
  currentMatchedPair: MatchingGameImage | null;
}

export function useMatchingGame(images: MatchingGameImage[], numColumns: number = 2) {
  const [gameState, setGameState] = useState<MatchingGameState>({
    originalImages: [],
    shuffledColumns: [],
    connections: [],
    selectedPosition: null,
    completedMatches: new Set(),
    isComplete: false,
    score: 0,
    showPairDialog: false,
    currentMatchedPair: null
  });

  // Shuffle array utility
  const shuffleArray = useCallback(<T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledColumns: MatchingGameImage[][] = [];
    
    // Create shuffled versions for each column (ALL columns are shuffled)
    for (let i = 0; i < numColumns; i++) {
      shuffledColumns.push(shuffleArray(images));
    }

    setGameState({
      originalImages: images,
      shuffledColumns,
      connections: [],
      selectedPosition: null,
      completedMatches: new Set(),
      isComplete: false,
      score: 0,
      showPairDialog: false,
      currentMatchedPair: null
    });
  }, [images, numColumns, shuffleArray]);

  // Handle tile click
  const handleTileClick = useCallback((imageId: string, column: number, index: number) => {
    const position: MatchPosition = { imageId, column, index };

    setGameState(prev => {
      // If no position is selected, select this one
      if (!prev.selectedPosition) {
        return { ...prev, selectedPosition: position };
      }

      // If same position is clicked, deselect
      if (prev.selectedPosition.imageId === imageId && 
          prev.selectedPosition.column === column && 
          prev.selectedPosition.index === index) {
        return { ...prev, selectedPosition: null };
      }

      // If clicking on the same column, replace selection
      if (prev.selectedPosition.column === column) {
        return { ...prev, selectedPosition: position };
      }

      // Check if it's a valid match (same image, different columns)
      if (prev.selectedPosition.imageId === imageId) {
        // Create connection
        const connectionId = `${prev.selectedPosition.imageId}-${Date.now()}`;
        const newConnection: Connection = {
          from: prev.selectedPosition,
          to: position,
          id: connectionId
        };

        const newCompletedMatches = new Set(prev.completedMatches);
        newCompletedMatches.add(imageId);

        const newConnections = [...prev.connections, newConnection];
        const isComplete = newCompletedMatches.size === prev.originalImages.length;

        // Find the matched image to show in dialog
        const matchedImage = prev.originalImages.find(img => img.word === imageId);

        return {
          ...prev,
          connections: newConnections,
          selectedPosition: null,
          completedMatches: newCompletedMatches,
          isComplete,
          score: prev.score + 10,
          showPairDialog: true,
          currentMatchedPair: matchedImage || null
        };
      }

      // Different images, replace selection
      return { ...prev, selectedPosition: position };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Check if a tile is selected
  const isTileSelected = useCallback((imageId: string, column: number, index: number) => {
    return gameState.selectedPosition?.imageId === imageId &&
           gameState.selectedPosition?.column === column &&
           gameState.selectedPosition?.index === index;
  }, [gameState.selectedPosition]);

  // Check if a tile is matched
  const isTileMatched = useCallback((imageId: string) => {
    return gameState.completedMatches.has(imageId);
  }, [gameState.completedMatches]);

  // Handle pair dialog continue
  const handlePairDialogContinue = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showPairDialog: false,
      currentMatchedPair: null
    }));
  }, []);

  // Initialize game on mount or when images change
  useEffect(() => {
    if (images.length > 0) {
      initializeGame();
    }
  }, [images, initializeGame]);

  return {
    gameState,
    handleTileClick,
    resetGame,
    isTileSelected,
    isTileMatched,
    handlePairDialogContinue
  };
}