import React, { useEffect, useState, useRef } from 'react';
import { BingoWord } from '@/data/bingoWordsR';
import { Button } from '@/components/ui/button';

interface BingoReelProps {
  words: BingoWord[];
  drawnWord: BingoWord | null;
  isSpinning: boolean;
  onSpin: () => void;
  disabled?: boolean;
}

export const BingoReel: React.FC<BingoReelProps> = ({
  words,
  drawnWord,
  isSpinning,
  onSpin,
  disabled
}) => {
  const [displayedWords, setDisplayedWords] = useState<BingoWord[]>([]);
  const [offset, setOffset] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create tick sound
  const playTick = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not available
    }
  };

  // Initialize display with random words
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setDisplayedWords(shuffled.slice(0, 5));
  }, [words]);

  // Spinning animation
  useEffect(() => {
    if (isSpinning) {
      let speed = 50;
      let elapsed = 0;
      
      const spin = () => {
        playTick();
        
        setDisplayedWords(prev => {
          const newWords = [...prev];
          newWords.shift();
          const randomWord = words[Math.floor(Math.random() * words.length)];
          newWords.push(randomWord);
          return newWords;
        });
        
        elapsed += speed;
        
        // Slow down over time
        if (elapsed > 1000) speed = 100;
        if (elapsed > 1500) speed = 200;
        if (elapsed > 1800) speed = 300;
        
        if (elapsed < 2000) {
          intervalRef.current = setTimeout(spin, speed);
        }
      };
      
      spin();
      
      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      };
    }
  }, [isSpinning, words]);

  // Show drawn word when spinning stops
  useEffect(() => {
    if (!isSpinning && drawnWord) {
      setDisplayedWords(prev => {
        const newWords = [...prev];
        newWords[2] = drawnWord; // Center position
        return newWords;
      });
    }
  }, [isSpinning, drawnWord]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Reel container */}
      <div className="relative w-full max-w-[320px] md:max-w-[400px] h-16 md:h-20 overflow-hidden bg-white/30 rounded-xl backdrop-blur-sm border-2 border-white/50">
        {/* Reel items */}
        <div 
          className="flex items-center justify-center h-full gap-1 px-1 transition-transform duration-100"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {displayedWords.map((word, index) => (
            <div
              key={`${word.word}-${index}`}
              className={`
                flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden
                transition-all duration-200
                ${index === 2 && !isSpinning ? 'ring-2 ring-yellow-400 scale-110' : 'opacity-70'}
              `}
            >
              <img
                src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${word.image}`}
                alt={word.word}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Center indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-400" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-yellow-400" />
      </div>
      
      {/* Spin button only */}
      <Button
        onClick={onSpin}
        disabled={isSpinning || disabled}
        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-sm md:text-base px-4 py-2 h-auto rounded-full shadow-lg"
      >
        {isSpinning ? 'VRTENJE...' : 'ZAVRTI'}
      </Button>
    </div>
  );
};

// Export drawn word for parent to use
export type { BingoReelProps };
