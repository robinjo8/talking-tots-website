import { useState, useCallback, useRef, useEffect } from 'react';

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

// Spinning sound effect using Web Audio API
const createSpinSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTickSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800 + Math.random() * 400;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    };
    
    return { playTickSound, audioContext };
  } catch (error) {
    console.error('Web Audio API not supported:', error);
    return null;
  }
};

export const useFortuneWheel = ({ 
  wordsData, 
  spinDuration = 3000 
}: UseFortuneWheelProps): UseFortuneWheelReturn => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const soundRef = useRef<{ playTickSound: () => void; audioContext: AudioContext } | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context on first interaction
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      if (soundRef.current?.audioContext) {
        soundRef.current.audioContext.close();
      }
    };
  }, []);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    // Initialize sound on first spin (requires user interaction)
    if (!soundRef.current) {
      soundRef.current = createSpinSound();
    }

    setIsSpinning(true);
    setShowResult(false);
    setSelectedWord(null);

    // Start tick sound effect
    if (soundRef.current) {
      let tickSpeed = 50; // Start fast
      const maxTickSpeed = 300; // End slow
      
      const playTicks = () => {
        if (tickIntervalRef.current) {
          clearTimeout(tickIntervalRef.current);
        }
        
        soundRef.current?.playTickSound();
        
        // Gradually slow down the ticks
        tickSpeed = Math.min(tickSpeed * 1.1, maxTickSpeed);
        
        if (tickSpeed < maxTickSpeed) {
          tickIntervalRef.current = setTimeout(playTicks, tickSpeed);
        }
      };
      
      playTicks();
    }

    // Calculate random winning segment
    const segmentCount = wordsData.length;
    const segmentAngle = 360 / segmentCount;
    
    // Random index for winning segment
    const winningIndex = Math.floor(Math.random() * segmentCount);
    
    const segmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
    
    // Add multiple full rotations for visual effect (5-8 full spins)
    const fullRotations = (5 + Math.random() * 3) * 360;
    
    const finalRotation = rotation + fullRotations + (360 - segmentCenter);

    setRotation(finalRotation);

    // After spin completes, show result
    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
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
