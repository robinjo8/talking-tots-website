import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface DiceRollerProps {
  isVisible: boolean;
  isRolling: boolean;
  onRollComplete: (result: number) => void;
  onClose: () => void;
}

// Dice face configurations for CSS 3D cube
const diceFaces = [
  { dots: 1, rotation: 'rotateY(0deg)' },
  { dots: 2, rotation: 'rotateY(-90deg)' },
  { dots: 3, rotation: 'rotateX(90deg)' },
  { dots: 4, rotation: 'rotateX(-90deg)' },
  { dots: 5, rotation: 'rotateY(90deg)' },
  { dots: 6, rotation: 'rotateY(180deg)' },
];

// Final rotations to show each number
const finalRotations: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(90deg)',
  3: 'rotateX(-90deg) rotateY(0deg)',
  4: 'rotateX(90deg) rotateY(0deg)',
  5: 'rotateX(0deg) rotateY(-90deg)',
  6: 'rotateX(0deg) rotateY(180deg)',
};

function DiceDots({ count }: { count: number }) {
  const dotPositions: Record<number, string[]> = {
    1: ['center'],
    2: ['top-right', 'bottom-left'],
    3: ['top-right', 'center', 'bottom-left'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };

  const getPositionClass = (pos: string) => {
    switch (pos) {
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-left': return 'top-3 left-3';
      case 'top-right': return 'top-3 right-3';
      case 'bottom-left': return 'bottom-3 left-3';
      case 'bottom-right': return 'bottom-3 right-3';
      case 'middle-left': return 'top-1/2 left-3 -translate-y-1/2';
      case 'middle-right': return 'top-1/2 right-3 -translate-y-1/2';
      default: return '';
    }
  };

  return (
    <>
      {dotPositions[count]?.map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full bg-gray-800 ${getPositionClass(pos)}`}
        />
      ))}
    </>
  );
}

export function DiceRoller({ isVisible, isRolling, onRollComplete, onClose }: DiceRollerProps) {
  const [rotation, setRotation] = useState('rotateX(0deg) rotateY(0deg)');
  const [result, setResult] = useState<number | null>(null);
  const [hasClicked, setHasClicked] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isVisible) {
      setRotation('rotateX(0deg) rotateY(0deg)');
      setResult(null);
      setHasClicked(false);
    }
  }, [isVisible]);

  // Handle rolling animation
  useEffect(() => {
    if (isRolling && hasClicked) {
      // Random spin animation
      let spinCount = 0;
      const maxSpins = 15 + Math.floor(Math.random() * 10);
      
      const spinInterval = setInterval(() => {
        const randomX = Math.floor(Math.random() * 360);
        const randomY = Math.floor(Math.random() * 360);
        setRotation(`rotateX(${randomX}deg) rotateY(${randomY}deg)`);
        spinCount++;
        
        if (spinCount >= maxSpins) {
          clearInterval(spinInterval);
          
          // Generate final result
          const finalResult = Math.floor(Math.random() * 6) + 1;
          setResult(finalResult);
          setRotation(finalRotations[finalResult]);
          
          // Notify parent after animation settles
          setTimeout(() => {
            onRollComplete(finalResult);
          }, 800);
        }
      }, 100);

      return () => clearInterval(spinInterval);
    }
  }, [isRolling, hasClicked, onRollComplete]);

  const handleDiceClick = useCallback(() => {
    if (!hasClicked && !isRolling) {
      setHasClicked(true);
    }
  }, [hasClicked, isRolling]);

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-transparent border-none shadow-none flex items-center justify-center max-w-none w-auto">
        <div 
          className="cursor-pointer"
          onClick={handleDiceClick}
        >
          {/* 3D Dice Container */}
          <div className="relative" style={{ perspective: '600px' }}>
            <div
              className="relative w-28 h-28 transition-transform"
              style={{
                transformStyle: 'preserve-3d',
                transform: rotation,
                transitionDuration: isRolling ? '100ms' : '800ms',
                transitionTimingFunction: isRolling ? 'linear' : 'ease-out',
              }}
            >
              {/* Face 1 - Front */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'translateZ(56px)' }}
              >
                <DiceDots count={1} />
              </div>
              
              {/* Face 6 - Back */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'rotateY(180deg) translateZ(56px)' }}
              >
                <DiceDots count={6} />
              </div>
              
              {/* Face 2 - Right */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'rotateY(90deg) translateZ(56px)' }}
              >
                <DiceDots count={2} />
              </div>
              
              {/* Face 5 - Left */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'rotateY(-90deg) translateZ(56px)' }}
              >
                <DiceDots count={5} />
              </div>
              
              {/* Face 3 - Top */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'rotateX(90deg) translateZ(56px)' }}
              >
                <DiceDots count={3} />
              </div>
              
              {/* Face 4 - Bottom */}
              <div 
                className="absolute w-28 h-28 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ transform: 'rotateX(-90deg) translateZ(56px)' }}
              >
                <DiceDots count={4} />
              </div>
            </div>
          </div>
          
          {!hasClicked && (
            <p className="text-white text-center mt-4 text-lg font-medium animate-pulse">
              Klikni na kocko!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
