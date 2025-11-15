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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (targetSequence.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ni na voljo slik za to igro.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Target Sequence - Top Row */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Cilj</h3>
          <p className="text-muted-foreground">Razporedi spodnje slike v ta vrstni red</p>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
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
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {isComplete ? "✨ Čestitam! ✨" : "Premikaj me"}
          </h3>
          <p className="text-muted-foreground">
            {isComplete ? "Pravilno si razporedil/-a slike!" : "Povleci in spusti slike, da jih razvrstiš"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6 bg-card rounded-xl border-2 border-border">
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
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-full border-2 border-green-500/20">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold">Igra je končana!</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};
