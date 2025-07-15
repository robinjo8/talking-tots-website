import { useState, useEffect } from "react";

const STORAGE_KEY = "vaje-motorike-govoril-progress";
const CACHE_VERSION = "v2.0.0";

interface ExerciseProgress {
  currentUnlockedCard: number;
  completedCards: number[];
}

export const useExerciseProgress = () => {
  const [progress, setProgress] = useState<ExerciseProgress>({
    currentUnlockedCard: 1,
    completedCards: [],
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
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedCards.includes(cardNumber);
      if (isAlreadyCompleted) return prev;

      const newCompletedCards = [...prev.completedCards, cardNumber];
      const newCurrentUnlocked = Math.max(prev.currentUnlockedCard, cardNumber + 1);

      // If completing card 27, reset to beginning
      if (cardNumber === 27) {
        return {
          currentUnlockedCard: 1,
          completedCards: [],
        };
      }

      return {
        currentUnlockedCard: Math.min(newCurrentUnlocked, 27),
        completedCards: newCompletedCards,
      };
    });
  };

  const resetProgress = () => {
    setProgress({
      currentUnlockedCard: 1,
      completedCards: [],
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