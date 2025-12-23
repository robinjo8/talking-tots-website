import { useState, useEffect } from "react";
import { useSequenceGame } from "@/hooks/useSequenceGame";
import { SequenceItem } from "./SequenceItem";
import { Loader2 } from "lucide-react";

interface SequenceGameCProps {
  onGameComplete: (images: any[]) => void;
}

export const SequenceGameC = ({ onGameComplete }: SequenceGameCProps) => {
  const { targetSequence, currentSequence, isComplete, isLoading, moveItem } = useSequenceGame("memory_cards_c", 4);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [gameCompletedTriggered, setGameCompletedTriggered] = useState(false);

  useEffect(() => {
    if (isComplete && !gameCompletedTriggered && targetSequence.length > 0) {
      setGameCompletedTriggered(true);
      // Trigger completion after a short delay for better UX
      setTimeout(() => {
        onGameComplete(targetSequence);
      }, 500);
    }
  }, [isComplete, targetSequence, onGameComplete, gameCompletedTriggered]);

  // Reset completion trigger when game resets
  useEffect(() => {
    if (!isComplete) {
      setGameCompletedTriggered(false);
    }
  }, [isComplete]);

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2 md:space-y-8 px-2 md:px-0">
      {/* Target Sequence - Top Row */}
      <div className="relative">
        {/* Lock icon centered on top border */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 md:-top-4 z-10">
          <div className="bg-amber-500 rounded-lg p-1.5 md:p-2 shadow-lg border-2 border-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-gray-400/50 mt-1 md:mt-2">
          {targetSequence.map((image, index) => (
            <SequenceItem
              key={`target-${image.id}`}
              image={image}
              index={index}
              isDraggable={false}
              isTarget={true}
            />
          ))}
        </div>
      </div>

      {/* Middle text */}
      <div className="text-center py-1 md:py-0">
        <h3 className="text-base md:text-2xl font-bold text-white mb-0.5 md:mb-2 drop-shadow-lg uppercase">
          {isComplete ? "✨ ČESTITAM! ✨" : "PREMIKAJ ME"}
        </h3>
        <p className="text-xs md:text-base text-white/90 drop-shadow uppercase">
          {isComplete ? "PRAVILNO SI RAZPOREDIL/-A SLIKE!" : "POVLECI IN SPUSTI SLIKE, DA JIH RAZVRSTIŠ"}
        </p>
      </div>

      {/* Current Sequence - Bottom Row (Draggable) */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6 bg-white/30 backdrop-blur-sm rounded-xl border-3 border-orange-400 animate-[pulse-border_2s_ease-in-out_infinite]">
          {currentSequence.map((image, index) => (
            <SequenceItem
              key={`current-${image.id}-${index}`}
              image={image}
              index={index}
              isDraggable={!isComplete}
              isTarget={false}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
        {/* Hand icon centered on bottom border with swipe animation */}
        {!isComplete && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 md:-bottom-4 z-10">
            <div className="bg-orange-500 rounded-lg p-1.5 md:p-2 shadow-lg border-2 border-orange-600 animate-[swipe-hand_2s_ease-in-out_infinite]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {isComplete && (
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
