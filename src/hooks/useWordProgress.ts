import { useState, useEffect, useCallback } from 'react';

interface WordProgress {
  [word: string]: number; // 0, 1, 2, or 3
}

interface UseWordProgressReturn {
  progress: WordProgress;
  incrementProgress: (word: string) => number; // returns new count
  getProgress: (word: string) => number;
  isCompleted: (word: string) => boolean;
  resetProgress: () => void;
  resetWordProgress: (word: string) => void; // Reset single word to 0
  getTotalCompleted: () => number;
  getTotalWords: () => number;
}

export const useWordProgress = (letter: string, words: string[]): UseWordProgressReturn => {
  const storageKey = `articulation-progress-${letter}`;
  
  const [progress, setProgress] = useState<WordProgress>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    // Initialize all words with 0
    const initial: WordProgress = {};
    words.forEach(word => {
      initial[word] = 0;
    });
    return initial;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [progress, storageKey]);

  const incrementProgress = useCallback((word: string): number => {
    let newCount = 0;
    setProgress(prev => {
      const currentCount = prev[word] || 0;
      if (currentCount >= 3) {
        newCount = 3;
        return prev; // Already completed
      }
      newCount = currentCount + 1;
      return {
        ...prev,
        [word]: newCount
      };
    });
    return newCount;
  }, []);

  const getProgress = useCallback((word: string): number => {
    return progress[word] || 0;
  }, [progress]);

  const isCompleted = useCallback((word: string): boolean => {
    return (progress[word] || 0) >= 3;
  }, [progress]);

  const resetProgress = useCallback(() => {
    const initial: WordProgress = {};
    words.forEach(word => {
      initial[word] = 0;
    });
    setProgress(initial);
  }, [words]);

  const resetWordProgress = useCallback((word: string) => {
    setProgress(prev => ({
      ...prev,
      [word]: 0
    }));
  }, []);

  const getTotalCompleted = useCallback((): number => {
    return Object.values(progress).filter(count => count >= 3).length;
  }, [progress]);

  const getTotalWords = useCallback((): number => {
    return words.length;
  }, [words]);

  return {
    progress,
    incrementProgress,
    getProgress,
    isCompleted,
    resetProgress,
    resetWordProgress,
    getTotalCompleted,
    getTotalWords
  };
};
