import { useState, useEffect } from "react";
import { useEnhancedProgress } from "./useEnhancedProgress";

const STORAGE_KEY = "vaje-motorike-govoril-progress";
const CACHE_VERSION = "v2.0.0";

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
        setProgress(parsed);
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
        const newState = {
          currentUnlockedCard: 1,
          completedCards: [],
          completionCount: prev.completionCount + 1,
        };
        // Force immediate localStorage update
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        
        // Record progress in Supabase
        recordExerciseCompletion('vaje_motorike_govoril');
        
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
    setProgress({
      currentUnlockedCard: 1,
      completedCards: [],
      completionCount: 0,
    });
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
    isCardLocked,
    isCardCompleted,
    isCardActive,
  };
};