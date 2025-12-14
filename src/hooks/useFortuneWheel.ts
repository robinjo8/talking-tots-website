import { useState, useCallback } from 'react';

interface WordData {
  word: string;
  image: string;
  audio: string;
}

interface UseFortuneWheelProps {
  wordsData: WordData[];
  spinDuration?: number;
}

interface UseFortuneWheelReturn {
  isSpinning: boolean;
  rotation: number;
  selectedWord: WordData | null;
  selectedIndex: number | null;
  showResult: boolean;
  spinWheel: () => void;
  resetWheel: () => void;
  closeResult: () => void;
}

export const useFortuneWheel = ({ 
  wordsData, 
  spinDuration = 3000 
}: UseFortuneWheelProps): UseFortuneWheelReturn => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedWord(null);

    // Calculate random winning segment
    const segmentCount = wordsData.length;
    const segmentAngle = 360 / segmentCount;
    
    // Random index for winning segment
    const winningIndex = Math.floor(Math.random() * segmentCount);
    
    // Calculate the rotation needed to land on this segment
    // The pointer is at the top (0 degrees), so we need to calculate accordingly
    // We want the winning segment to be under the pointer
    const segmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
    
    // Add multiple full rotations for visual effect (5-8 full spins)
    const fullRotations = (5 + Math.random() * 3) * 360;
    
    // Final rotation: current rotation + full spins + adjustment to land on segment
    // The pointer is at top, so segment 0 starts from the right side
    // We need to rotate so that the winning segment aligns with the top pointer
    const finalRotation = rotation + fullRotations + (360 - segmentCenter);

    setRotation(finalRotation);

    // After spin completes, show result
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(winningIndex);
      setSelectedWord(wordsData[winningIndex]);
      setShowResult(true);
    }, spinDuration);
  }, [isSpinning, rotation, wordsData, spinDuration]);

  const resetWheel = useCallback(() => {
    setIsSpinning(false);
    setRotation(0);
    setSelectedWord(null);
    setSelectedIndex(null);
    setShowResult(false);
  }, []);

  const closeResult = useCallback(() => {
    setShowResult(false);
    setSelectedWord(null);
    setSelectedIndex(null);
  }, []);

  return {
    isSpinning,
    rotation,
    selectedWord,
    selectedIndex,
    showResult,
    spinWheel,
    resetWheel,
    closeResult,
  };
};
