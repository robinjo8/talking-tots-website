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
    <div className="flex flex-col items-center gap-4">
      {/* Reel container */}
      <div className="relative w-full max-w-md h-24 md:h-32 overflow-hidden bg-white/30 rounded-xl backdrop-blur-sm border-4 border-white/50">
        {/* Reel items */}
        <div 
          className="flex items-center justify-center h-full gap-2 px-2 transition-transform duration-100"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {displayedWords.map((word, index) => (
            <div
              key={`${word.word}-${index}`}
              className={`
                flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden
                transition-all duration-200
                ${index === 2 && !isSpinning ? 'ring-4 ring-yellow-400 scale-110' : 'opacity-70'}
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-yellow-400" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-400" />
      </div>
      
      {/* Drawn word label */}
      {drawnWord && !isSpinning && (
        <div className="text-xl md:text-2xl font-bold text-white drop-shadow-lg animate-bounce">
          Najdi: {drawnWord.word}
        </div>
      )}
      
      {/* Spin button */}
      <Button
        onClick={onSpin}
        disabled={isSpinning || disabled}
        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-lg md:text-xl px-8 py-4 h-auto rounded-full shadow-lg"
      >
        {isSpinning ? '🎰 VRTENJE...' : '🎰 ZAVRTI'}
      </Button>
    </div>
  );
};
