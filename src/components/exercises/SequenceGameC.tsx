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
        <p className="text-white/80 drop-shadow">Ni na voljo slik za to igro.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Target Sequence - Top Row */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Cilj</h3>
          <p className="text-white/90 drop-shadow">Razporedi spodnje slike v ta vrstni red</p>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-orange-400/50">
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

      {/* Current Sequence - Bottom Row (Draggable) */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {isComplete ? "✨ Čestitam! ✨" : "Premikaj me"}
          </h3>
          <p className="text-white/90 drop-shadow">
            {isComplete ? "Pravilno si razporedil/-a slike!" : "Povleci in spusti slike, da jih razvrstiš"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-orange-400">
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
      </div>

      {isComplete && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border-2 border-white/30">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold drop-shadow">Igra je končana!</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};
