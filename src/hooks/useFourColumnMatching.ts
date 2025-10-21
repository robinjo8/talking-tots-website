import { useState, useEffect } from 'react';
import { FourColumnMatchingItem } from '@/data/threeColumnMatchingData';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

export interface FourColumnConnection {
  audioId: string;
  writtenId: string;
  shadowId: string;
  originalId: string;
  isCorrect: boolean;
}

export interface FourColumnGameState {
  items: FourColumnMatchingItem[];
  shuffledAudio: string[];
  shuffledWritten: string[];
  shuffledShadows: string[];
  shuffledOriginals: string[];
  selectedAudio: string | null;
  selectedWritten: string | null;
  selectedShadow: string | null;
  selectedOriginal: string | null;
  connections: FourColumnConnection[];
  completedItems: Set<string>;
  isComplete: boolean;
  score: number;
}

export function useFourColumnMatching(items: FourColumnMatchingItem[]) {
  const { playAudio } = useAudioPlayback();
  const [gameState, setGameState] = useState<FourColumnGameState>({
    items: [],
    shuffledAudio: [],
    shuffledWritten: [],
    shuffledShadows: [],
    shuffledOriginals: [],
    selectedAudio: null,
    selectedWritten: null,
    selectedShadow: null,
    selectedOriginal: null,
    connections: [],
    completedItems: new Set(),
    isComplete: false,
    score: 0
  });

  const initializeGame = () => {
    const shuffledAudio = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);
    const shuffledWritten = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);
    const shuffledShadows = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);
    const shuffledOriginals = [...items.map(item => item.id)].sort(() => Math.random() - 0.5);

    setGameState({
      items,
      shuffledAudio,
      shuffledWritten,
      shuffledShadows,
      shuffledOriginals,
      selectedAudio: null,
      selectedWritten: null,
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
    
    setGameState(prev => ({
      ...prev,
      selectedAudio: prev.selectedAudio === itemId ? null : itemId
    }));
  };

  const selectWritten = (itemId: string) => {
    if (gameState.completedItems.has(itemId)) return;
    
    setGameState(prev => ({
      ...prev,
      selectedWritten: prev.selectedWritten === itemId ? null : itemId
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
    const { selectedAudio, selectedWritten, selectedShadow, selectedOriginal } = gameState;
    
    if (!selectedAudio || !selectedWritten || !selectedShadow || !selectedOriginal) return;

    const isCorrect = selectedAudio === selectedWritten && 
                      selectedWritten === selectedShadow && 
                      selectedShadow === selectedOriginal;
    
    const newConnection: FourColumnConnection = {
      audioId: selectedAudio,
      writtenId: selectedWritten,
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
        
        // Play audio for matched pair
        const matchedItem = prev.items.find(item => item.id === selectedAudio);
        if (matchedItem) {
          const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${matchedItem.audioFile}`;
          const audio = new Audio(audioUrl);
          
          // Check if this is the last match
          const willBeComplete = newCompletedItems.size === prev.items.length;
          
          if (willBeComplete) {
            // Delay completion until audio finishes
            audio.onended = () => {
              setGameState(current => ({
                ...current,
                isComplete: true
              }));
            };
          }
          
          audio.play().catch(err => console.error('Error playing audio:', err));
        }
      }

      const newConnections = [...prev.connections, newConnection];
      const isComplete = isCorrect ? false : newCompletedItems.size === prev.items.length;

      return {
        ...prev,
        connections: newConnections,
        completedItems: newCompletedItems,
        selectedAudio: null,
        selectedWritten: null,
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

  const isItemSelected = (itemId: string, column: 'audio' | 'written' | 'shadow' | 'original') => {
    switch (column) {
      case 'audio':
        return gameState.selectedAudio === itemId;
      case 'written':
        return gameState.selectedWritten === itemId;
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

  // Check for match when all four items are selected
  useEffect(() => {
    checkForMatch();
  }, [gameState.selectedAudio, gameState.selectedWritten, gameState.selectedShadow, gameState.selectedOriginal]);

  // Initialize game when items change
  useEffect(() => {
    if (items.length > 0) {
      initializeGame();
    }
  }, [items]);

  return {
    gameState,
    selectAudio,
    selectWritten,
    selectShadow,
    selectOriginal,
    resetGame,
    isItemSelected,
    isItemCompleted
  };
}