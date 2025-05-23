
import { useState, useEffect, useRef } from 'react';

export const useSlidePuzzleTimer = (isPlaying: boolean, isWon: boolean) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isWon) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isWon]);

  // Reset timer when starting a new game
  useEffect(() => {
    if (isPlaying && !isWon && time === 0) {
      // Timer will start from useEffect above
    } else if (!isPlaying && !isWon) {
      // Reset timer for new game
      setTime(0);
    }
  }, [isPlaying, isWon]);

  return { time };
};
