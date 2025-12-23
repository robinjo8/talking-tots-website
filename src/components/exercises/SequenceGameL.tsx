import { useState, useEffect, useMemo } from "react";
import { useSequenceGame } from "@/hooks/useSequenceGame";
import { SequenceItem } from "./SequenceItem";
import { Loader2 } from "lucide-react";

interface SequenceGameLProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameL = ({ onGameComplete, isLandscape = false }: SequenceGameLProps) => {
  const { targetSequence, currentSequence, isComplete, isLoading, moveItem } = useSequenceGame("memory_cards_l", 4);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [gameCompletedTriggered, setGameCompletedTriggered] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isComplete && !gameCompletedTriggered && targetSequence.length > 0) {
      setGameCompletedTriggered(true);
      setTimeout(() => {
        onGameComplete(targetSequence);
      }, 500);
    }
  }, [isComplete, targetSequence, onGameComplete, gameCompletedTriggered]);

  useEffect(() => {
    if (!isComplete) {
      setGameCompletedTriggered(false);
    }
  }, [isComplete]);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    const handleOrientationChange = () => setTimeout(updateSize, 100);
    
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const itemSize = useMemo(() => {
    if (!isLandscape || windowSize.width === 0 || windowSize.height === 0) {
      return undefined;
    }

    const columns = 4;
    const rows = 2;
    const gap = 8;
    const PADDING = 8;
    const TEXT_HEIGHT = 40;
    
    const availableWidth = windowSize.width - PADDING * 2;
    const availableHeight = windowSize.height - PADDING * 2 - TEXT_HEIGHT;
    
    const sizeByWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns);
    const sizeByHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows);
    
    return Math.floor(Math.min(sizeByWidth, sizeByHeight) * 0.92);
  }, [isLandscape, windowSize]);

  const gridWidth = itemSize ? 4 * itemSize + 8 * 3 : 0;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveItem(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (targetSequence.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/80 drop-shadow uppercase">NI NA VOLJO SLIK ZA TO IGRO.</p>
      </div>
    );
  }

  if (isLandscape && !itemSize) {
    return null;
  }

  return (
    <div 
      className={`w-full mx-auto ${isLandscape ? 'h-full flex flex-col items-center justify-center' : 'max-w-4xl space-y-2 md:space-y-8 px-2 md:px-0'}`}
      style={{ touchAction: 'none' }}
    >
      <div className="relative">
        <div className={`absolute left-1/2 -translate-x-1/2 z-10 ${isLandscape ? '-top-2' : '-top-3 md:-top-4'}`}>
          <div className={`bg-amber-500 rounded-lg shadow-lg border-2 border-amber-600 ${isLandscape ? 'p-1' : 'p-1.5 md:p-2'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`text-white ${isLandscape ? 'w-3 h-3' : 'w-4 h-4 md:w-5 md:h-5'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <div 
          className={`bg-white/20 backdrop-blur-sm rounded-xl border-2 border-gray-400/50 ${isLandscape ? 'flex justify-center gap-2 p-2 mt-1' : 'grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6 mt-1 md:mt-2'}`}
          style={isLandscape && itemSize ? { width: gridWidth } : {}}
        >
          {targetSequence.map((image, index) => (
            <SequenceItem
              key={`target-${image.id}`}
              image={image}
              index={index}
              isDraggable={false}
              isTarget={true}
              size={itemSize}
            />
          ))}
        </div>
      </div>

      <div className={`text-center ${isLandscape ? 'py-1' : 'py-1 md:py-0'}`}>
        <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
          {isComplete ? "✨ ČESTITAM! ✨" : "PREMIKAJ ME"}
        </h3>
        {!isLandscape && (
          <p className="text-xs md:text-base text-white/90 drop-shadow uppercase">
            {isComplete ? "PRAVILNO SI RAZPOREDIL/-A SLIKE!" : "POVLECI IN SPUSTI SLIKE, DA JIH RAZVRSTIŠ"}
          </p>
        )}
      </div>

      <div className="relative">
        <div 
          className={`bg-white/30 backdrop-blur-sm rounded-xl border-3 border-orange-400 animate-[pulse-border_2s_ease-in-out_infinite] ${isLandscape ? 'flex justify-center gap-2 p-2' : 'grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6'}`}
          style={isLandscape && itemSize ? { width: gridWidth } : {}}
        >
          {currentSequence.map((image, index) => (
            <SequenceItem
              key={`current-${image.id}-${index}`}
              image={image}
              index={index}
              isDraggable={!isComplete}
              isTarget={false}
              size={itemSize}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
        {!isComplete && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-10 ${isLandscape ? '-bottom-2' : '-bottom-3 md:-bottom-4'}`}>
            <div className={`bg-orange-500 rounded-lg shadow-lg border-2 border-orange-600 animate-[swipe-hand_2s_ease-in-out_infinite] ${isLandscape ? 'p-1' : 'p-1.5 md:p-2'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`text-white ${isLandscape ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {isComplete && !isLandscape && (
        <div className="text-center py-2 md:py-4">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-white/30">
            <span className="text-lg md:text-2xl">🎉</span>
            <span className="text-sm md:text-base font-semibold drop-shadow uppercase">IGRA JE KONČANA!</span>
            <span className="text-lg md:text-2xl">🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};
