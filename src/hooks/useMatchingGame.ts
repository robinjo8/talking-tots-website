import { useState, useCallback, useEffect, useRef } from 'react';
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
}

export function useMatchingGame(images: MatchingGameImage[], numColumns: number = 2) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [gameState, setGameState] = useState<MatchingGameState>({
    originalImages: [],
    shuffledColumns: [],
    connections: [],
    selectedPosition: null,
    completedMatches: new Set(),
    isComplete: false,
    score: 0
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
      score: 0
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
        // Find the matched image to get its audio URL
        const matchedImage = prev.originalImages.find(img => img.word === imageId);
        
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
        const willBeComplete = newCompletedMatches.size === prev.originalImages.length;

        // Play audio if available - reuse element for Safari
        if (matchedImage?.audio_url) {
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = matchedImage.audio_url;
          audioRef.current.load();
          
          if (willBeComplete) {
            audioRef.current.onended = () => {
              setGameState(current => ({
                ...current,
                isComplete: true
              }));
            };
          }
          
          audioRef.current.play().catch(error => {
            console.error("Error playing match audio:", error);
            if (willBeComplete) {
              setGameState(current => ({
                ...current,
                isComplete: true
              }));
            }
          });
        } else if (willBeComplete) {
          // No audio, mark as complete immediately
          return {
            ...prev,
            connections: newConnections,
            selectedPosition: null,
            completedMatches: newCompletedMatches,
            isComplete: true,
            score: prev.score + 10
          };
        }

        return {
          ...prev,
          connections: newConnections,
          selectedPosition: null,
          completedMatches: newCompletedMatches,
          isComplete: willBeComplete && !matchedImage?.audio_url ? true : false,
          score: prev.score + 10
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
    isTileMatched
  };
}