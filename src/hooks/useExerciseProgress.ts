
import { useState, useEffect } from "react";
import { useEnhancedProgress } from "./useEnhancedProgress";

const STORAGE_KEY = "vaje-motorike-govoril-progress";
const CACHE_VERSION = "v3.0.0";

interface ExerciseProgress {
  currentUnlockedCard: number;
  completedCards: number[];
  completionCount: number;
}

export const useExerciseProgress = () => {
  const { recordExerciseCompletion } = useEnhancedProgress();
  const [progress, setProgress] = useState<ExerciseProgress>({
    currentUnlockedCard: 1,
    completedCards: [],
    completionCount: 0,
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check version and load saved progress
        if (parsed.version === CACHE_VERSION) {
          setProgress({
            currentUnlockedCard: parsed.currentUnlockedCard || 1,
            completedCards: parsed.completedCards || [],
            completionCount: parsed.completionCount || 0,
          });
          console.log("Loaded saved progress:", parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    }
    // If no saved progress or invalid version, start fresh
    console.log("No saved progress found, starting fresh");
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = { ...progress, version: CACHE_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [progress]);

  const completeCard = (cardNumber: number) => {
    console.log(`Completing card ${cardNumber}`, { currentProgress: progress });
    
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedCards.includes(cardNumber);
      if (isAlreadyCompleted) return prev;

      const newCompletedCards = [...prev.completedCards, cardNumber];
      const newCurrentUnlocked = Math.max(prev.currentUnlockedCard, cardNumber + 1);

      // Check if completing card 27 AND all previous cards (1-26) are completed
      if (cardNumber === 27 && prev.completedCards.length === 26) {
        console.log("Completing full cycle, incrementing completion count");
        
        // Only record exercise completion when all 27 cards are done
        recordExerciseCompletion('vaje_motorike_govoril');
        
        const newState = {
          currentUnlockedCard: 1,
          completedCards: [],
          completionCount: prev.completionCount + 1,
          version: CACHE_VERSION
        };
        
        // Force immediate localStorage update
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        
        return newState;
      }

      return {
        currentUnlockedCard: Math.min(newCurrentUnlocked, 27),
        completedCards: newCompletedCards,
        completionCount: prev.completionCount,
      };
    });
  };

  const resetProgress = () => {
    const resetState = {
      currentUnlockedCard: 1,
      completedCards: [],
      completionCount: 0,
    };
    setProgress(resetState);
  };

  const setTestCompletionCount = (count: number) => {
    console.log(`Setting test completion count to ${count}`);
    
    // Update local storage and state
    const newState = {
      currentUnlockedCard: 1,
      completedCards: [],
      completionCount: count,
      version: CACHE_VERSION
    };
    
    setProgress(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    // Record the exact number of completions in Supabase
    // Each completion represents one full 27-card cycle = 1 star
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        recordExerciseCompletion('vaje_motorike_govoril');
      }, i * 100); // Small delay to ensure all records are created
    }
  };

  const isCardLocked = (cardNumber: number) => {
    return cardNumber > progress.currentUnlockedCard;
  };

  const isCardCompleted = (cardNumber: number) => {
    return progress.completedCards.includes(cardNumber);
  };

  const isCardActive = (cardNumber: number) => {
    return cardNumber === progress.currentUnlockedCard && !isCardCompleted(cardNumber);
  };

  return {
    progress,
    completeCard,
    resetProgress,
    setTestCompletionCount,
    isCardLocked,
    isCardCompleted,
    isCardActive,
  };
};
