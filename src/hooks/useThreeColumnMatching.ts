import { useState, useEffect, useRef } from 'react';
import { ThreeColumnMatchingItem } from '@/data/threeColumnMatchingData';

export interface ThreeColumnConnection {
  audioId: string;
  shadowId: string;
  originalId: string;
  isCorrect: boolean;
}

export interface ThreeColumnGameState {
  items: ThreeColumnMatchingItem[];
  shuffledAudio: string[];
  shuffledShadows: string[];
  shuffledOriginals: string[];
  selectedAudio: string | null;
  selectedShadow: string | null;
  selectedOriginal: string | null;
  connections: ThreeColumnConnection[];
  completedItems: Set<string>;
  isComplete: boolean;
  score: number;
}

export function useThreeColumnMatching(items: ThreeColumnMatchingItem[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [gameState, setGameState] = useState<ThreeColumnGameState>({
    items: [],
    shuffledAudio: [],
    shuffledShadows: [],
    shuffledOriginals: [],
    selectedAudio: null,
    selectedShadow: null,
    selectedOriginal: null,
    connections: [],
    completedItems: new Set(),
    isComplete: false,
    score: 0
  });

  const initializeGame = () => {
    const shuffledAudio = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);
    const shuffledShadows = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);
    const shuffledOriginals = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);

    setGameState({
      items,
      shuffledAudio,
      shuffledShadows,
      shuffledOriginals,
      selectedAudio: null,
      selectedShadow: null,
      selectedOriginal: null,
      connections: [],
      completedItems: new Set(),
      isComplete: false,
      score: 0
    });
  };

  const selectAudio = (itemId: string) => {
    if (gameState.completedItems.has(itemId)) return;
    
    // Play audio BEFORE state update - try .mp3 first, fallback to .m4a
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Try mp3 format first (more widely supported)
      const audioFileName = item.audioFile.replace('.m4a', '.mp3');
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFileName}`;
      
      try {
        console.log('Playing audio from URL:', audioUrl);
        
        // Stop any existing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
        
        // Create a fresh audio element
        audioRef.current = new Audio(audioUrl);
        
        // Play immediately
        audioRef.current.play().then(() => {
          console.log('Audio started playing successfully');
        }).catch(error => {
          console.error("Error playing audio:", error);
          console.error("Audio URL that failed:", audioUrl);
        });
      } catch (error) {
        console.error("Error setting up audio playback:", error);
      }
    }
    
    setGameState(prev => ({
      ...prev,
      selectedAudio: prev.selectedAudio === itemId ? null : itemId
    }));
  };

  const selectShadow = (itemId: string) => {
    if (gameState.completedItems.has(itemId)) return;
    
    setGameState(prev => ({
      ...prev,
      selectedShadow: prev.selectedShadow === itemId ? null : itemId
    }));
  };

  const selectOriginal = (itemId: string) => {
    if (gameState.completedItems.has(itemId)) return;
    
    setGameState(prev => ({
      ...prev,
      selectedOriginal: prev.selectedOriginal === itemId ? null : itemId
    }));
  };

  const checkForMatch = () => {
    const { selectedAudio, selectedShadow, selectedOriginal } = gameState;
    
    if (!selectedAudio || !selectedShadow || !selectedOriginal) return;

    const isCorrect = selectedAudio === selectedShadow && selectedShadow === selectedOriginal;
    
    const newConnection: ThreeColumnConnection = {
      audioId: selectedAudio,
      shadowId: selectedShadow,
      originalId: selectedOriginal,
      isCorrect
    };

    setGameState(prev => {
      const newCompletedItems = new Set(prev.completedItems);
      let newScore = prev.score;
      
      if (isCorrect) {
        newCompletedItems.add(selectedAudio);
        newScore += 1;
      }

      const newConnections = [...prev.connections, newConnection];
      const isComplete = newCompletedItems.size === prev.items.length;

      return {
        ...prev,
        connections: newConnections,
        completedItems: newCompletedItems,
        selectedAudio: null,
        selectedShadow: null,
        selectedOriginal: null,
        isComplete,
        score: newScore
      };
    });
  };

  const resetGame = () => {
    initializeGame();
  };

  const isItemSelected = (itemId: string, column: 'audio' | 'shadow' | 'original') => {
    switch (column) {
      case 'audio':
        return gameState.selectedAudio === itemId;
      case 'shadow':
        return gameState.selectedShadow === itemId;
      case 'original':
        return gameState.selectedOriginal === itemId;
      default:
        return false;
    }
  };

  const isItemCompleted = (itemId: string) => {
    return gameState.completedItems.has(itemId);
  };

  // Check for match when all three items are selected
  useEffect(() => {
    checkForMatch();
  }, [gameState.selectedAudio, gameState.selectedShadow, gameState.selectedOriginal]);

  // Initialize game when items change
  useEffect(() => {
    if (items.length > 0) {
      initializeGame();
    }
  }, [items]);

  return {
    gameState,
    selectAudio,
    selectShadow,
    selectOriginal,
    resetGame,
    isItemSelected,
    isItemCompleted
  };
}