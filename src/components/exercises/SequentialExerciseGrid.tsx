import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { SequentialCard } from "./SequentialCard";
import { ExerciseModal } from "./ExerciseModal";
import { CongratulationsDialog } from "./CongratulationsDialog";
import { exerciseInstructions } from "@/data/exerciseInstructions";

interface SequentialExerciseGridProps {
  exerciseProgressHook: {
    progress: {
      currentUnlockedCard: number;
      completedCards: number[];
      completionCount: number;
    };
    completeCard: (cardNumber: number) => void;
    resetProgress: () => void;
    isCardLocked: (cardNumber: number) => boolean;
    isCardCompleted: (cardNumber: number) => boolean;
    isCardActive: (cardNumber: number) => boolean;
  };
  gridClassName?: string;
  isMobile?: boolean;
}

export const SequentialExerciseGrid = ({ exerciseProgressHook, gridClassName = "grid-cols-5", isMobile = false }: SequentialExerciseGridProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [congratulationsCount, setCongratulationsCount] = useState(0);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { 
    progress, 
    completeCard, 
    isCardLocked, 
    isCardCompleted, 
    isCardActive 
  } = exerciseProgressHook;

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
      console.log("Before completing card:", selectedCard, "Current completion count:", progress.completionCount);
      
      // Show congratulations dialog when completing card 27
      if (selectedCard === 27) {
        // Calculate what the new completion count will be
        const newCompletionCount = progress.completedCards.length === 26 ? progress.completionCount + 1 : progress.completionCount;
        console.log("Setting congratulations count to:", newCompletionCount);
        setCongratulationsCount(newCompletionCount);
        setShowCongratulations(true);
      }
      
      completeCard(selectedCard);
      setSelectedCard(null);
    }
  }, [selectedCard, completeCard, progress.completionCount, progress.completedCards.length]);

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

  // Auto-scroll after 12 completed cards
  useEffect(() => {
    if (isMobile && progress.completedCards.length === 12 && !hasAutoScrolled && gridRef.current) {
      const scrollTarget = gridRef.current.scrollHeight * 0.5;
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
      setHasAutoScrolled(true);
      console.log("Auto-scrolled after 12 cards");
    }
    // Reset auto-scroll flag when progress resets
    if (progress.completedCards.length < 12) {
      setHasAutoScrolled(false);
    }
  }, [progress.completedCards.length, isMobile, hasAutoScrolled]);

  return (
    <>
      <div ref={gridRef} className={`w-full ${isMobile ? 'h-full px-1 pb-24' : 'max-w-7xl my-[121px]'} mx-auto ${isMobile ? '' : 'p-4'}`}>
        <div className={`grid ${gridClassName} ${isMobile ? 'gap-1 h-full auto-rows-fr' : 'gap-4 auto-rows-fr'}`}>
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
        completionCount={congratulationsCount}
      />
    </>
  );
};