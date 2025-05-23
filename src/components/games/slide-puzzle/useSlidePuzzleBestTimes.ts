
import { useState, useCallback } from 'react';

interface BestTimes {
  [size: number]: number;
}

export const useSlidePuzzleBestTimes = () => {
  const [bestTimes, setBestTimes] = useState<BestTimes>(() => {
    const saved = localStorage.getItem('slide-puzzle-best-times');
    return saved ? JSON.parse(saved) : {};
  });

  const saveBestTime = useCallback((size: number, time: number) => {
    setBestTimes(prev => {
      const currentBest = prev[size];
      if (!currentBest || time < currentBest) {
        const newBestTimes = { ...prev, [size]: time };
        localStorage.setItem('slide-puzzle-best-times', JSON.stringify(newBestTimes));
        return newBestTimes;
      }
      return prev;
    });
  }, []);

  return { bestTimes, saveBestTime };
};
