import { useState, useEffect, useCallback } from 'react';

interface DiceRollerProps {
  isVisible: boolean;
  currentStep: number;
  onRollComplete: (result: number) => void;
}

// Final rotations to show each number (matching the 3D cube faces)
// Face 1 = Front (translateZ), Face 6 = Back (rotateY 180deg)
// Face 2 = Right (rotateY 90deg), Face 5 = Left (rotateY -90deg)  
// Face 3 = Top (rotateX 90deg), Face 4 = Bottom (rotateX -90deg)
const finalRotations: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',      // Show front face (1)
  2: 'rotateX(0deg) rotateY(-90deg)',    // Show right face (2)
  3: 'rotateX(-90deg) rotateY(0deg)',    // Show top face (3)
  4: 'rotateX(90deg) rotateY(0deg)',     // Show bottom face (4)
  5: 'rotateX(0deg) rotateY(90deg)',     // Show left face (5)
  6: 'rotateX(0deg) rotateY(180deg)',    // Show back face (6)
};

const stepLabels = ['BITJE', 'POVEDEK', 'PREDMET'];

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

export function DiceRoller({ isVisible, currentStep, onRollComplete }: DiceRollerProps) {
  const [rotation, setRotation] = useState('rotateX(0deg) rotateY(0deg)');
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isVisible) {
      setRotation('rotateX(0deg) rotateY(0deg)');
      setIsSpinning(false);
      setHasClicked(false);
    }
  }, [isVisible]);

  // Handle spinning animation
  useEffect(() => {
    if (isSpinning) {
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
          setRotation(finalRotations[finalResult]);
          setIsSpinning(false);
          
          // Notify parent after animation settles
          setTimeout(() => {
            onRollComplete(finalResult);
          }, 800);
        }
      }, 100);

      return () => clearInterval(spinInterval);
    }
  }, [isSpinning, onRollComplete]);

  const handleDiceClick = useCallback(() => {
    if (!hasClicked && !isSpinning) {
      setHasClicked(true);
      setIsSpinning(true);
    }
  }, [hasClicked, isSpinning]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
      {/* Step indicator */}
      <p className="text-white text-center mb-4 text-xl font-bold drop-shadow-lg pointer-events-none">
        {currentStep + 1}. met: {stepLabels[currentStep]}
      </p>
      
      <div 
        className="cursor-pointer pointer-events-auto"
        onClick={handleDiceClick}
      >
        {/* 3D Dice Container */}
        <div className="relative" style={{ perspective: '600px' }}>
          <div
            className={`relative w-28 h-28 transition-transform ${!hasClicked ? 'animate-pulse' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              transform: rotation,
              transitionDuration: isSpinning ? '100ms' : '800ms',
              transitionTimingFunction: isSpinning ? 'linear' : 'ease-out',
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
          <p className="text-white text-center mt-4 text-lg font-medium animate-pulse pointer-events-none">
            Klikni na kocko!
          </p>
        )}
      </div>
    </div>
  );
}
