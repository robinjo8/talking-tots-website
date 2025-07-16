import { useState, useCallback, useMemo } from "react";
import { SequentialCard } from "./SequentialCard";
import { ExerciseModal } from "./ExerciseModal";
import { CongratulationsDialog } from "./CongratulationsDialog";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { exerciseInstructions } from "@/data/exerciseInstructions";

export const SequentialExerciseGrid = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const { 
    progress, 
    completeCard, 
    isCardLocked, 
    isCardCompleted, 
    isCardActive 
  } = useExerciseProgress();

  const handleCardClick = useCallback((cardNumber: number) => {
    if (!isCardLocked(cardNumber)) {
      setSelectedCard(cardNumber);
    }
  }, [isCardLocked]);

  const handleCloseModal = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleCompleteExercise = useCallback(() => {
    if (selectedCard) {
      completeCard(selectedCard);
      
      // Show congratulations dialog when completing card 27
      if (selectedCard === 27) {
        setShowCongratulations(true);
      }
      
      setSelectedCard(null);
    }
  }, [selectedCard, completeCard]);

  const getImageUrl = (cardNumber: number) => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/vaje-motorike-govoril/${cardNumber}.jpg`;
  };

  const getAudioUrl = (cardNumber: number) => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/vaje-motorike-govoril/${cardNumber}.m4a`;
  };

  const renderedCards = useMemo(() => {
    const cards = [];
    for (let i = 1; i <= 27; i++) {
      cards.push(
        <SequentialCard
          key={i}
          number={i}
          isLocked={isCardLocked(i)}
          isCompleted={isCardCompleted(i)}
          isActive={isCardActive(i)}
          onClick={() => handleCardClick(i)}
        />
      );
    }
    return cards;
  }, [isCardLocked, isCardCompleted, isCardActive, handleCardClick]);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-5 gap-4 auto-rows-fr">
          {renderedCards}
        </div>
      </div>

      {selectedCard && (
        <ExerciseModal
          isOpen={true}
          onClose={handleCloseModal}
          cardNumber={selectedCard}
          instruction={exerciseInstructions[selectedCard - 1]}
          imageUrl={getImageUrl(selectedCard)}
          audioUrl={getAudioUrl(selectedCard)}
          onComplete={handleCompleteExercise}
        />
      )}

      <CongratulationsDialog
        isOpen={showCongratulations}
        onClose={() => setShowCongratulations(false)}
        completionCount={progress.completionCount}
      />
    </>
  );
};