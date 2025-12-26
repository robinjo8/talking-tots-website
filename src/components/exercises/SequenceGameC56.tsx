import { useState, useEffect, useMemo, useCallback } from "react";
import { useSequenceGame, SequenceImage } from "@/hooks/useSequenceGame";
import { SequenceImageSelectionDialog } from "./SequenceImageSelectionDialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SequenceGameC56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

type GamePhase = "memorize" | "play";

export const SequenceGameC56 = ({ onGameComplete, isLandscape = false }: SequenceGameC56Props) => {
  const { targetSequence, isLoading, resetGame } = useSequenceGame("memory_cards_c", 4);
  
  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("memorize");
  const [countdown, setCountdown] = useState(10);
  const [placedImages, setPlacedImages] = useState<(SequenceImage | null)[]>([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [gameCompletedTriggered, setGameCompletedTriggered] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpCountdown, setHelpCountdown] = useState(5);
  const [helpUsed, setHelpUsed] = useState(false);
  
  // Window size for responsive layout
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Shuffle images for selection dialog (don't show in correct order)
  const shuffledImagesForSelection = useMemo(() => {
    if (!targetSequence.length) return [];
    const shuffled = [...targetSequence];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [targetSequence]);

  // Measure window size
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', () => setTimeout(updateSize, 100));
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', () => setTimeout(updateSize, 100));
    };
  }, []);

  // Memorize phase countdown
  useEffect(() => {
    if (gamePhase !== "memorize" || targetSequence.length === 0) return;
    
    if (countdown <= 0) {
      setGamePhase("play");
      return;
    }
    
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, gamePhase, targetSequence]);

  // Help countdown
  useEffect(() => {
    if (!showHelp) return;
    
    if (helpCountdown <= 0) {
      setShowHelp(false);
      setHelpCountdown(5);
      return;
    }
    
    const timer = setTimeout(() => setHelpCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [helpCountdown, showHelp]);

  // Check completion
  useEffect(() => {
    if (gamePhase !== "play" || placedImages.some(img => img === null)) return;
    
    const allCorrect = placedImages.every((img, index) => 
      img?.id === targetSequence[index]?.id
    );
    
    if (allCorrect && !isComplete) {
      setIsComplete(true);
    }
  }, [placedImages, targetSequence, gamePhase, isComplete]);

  // Trigger game complete callback
  useEffect(() => {
    if (isComplete && !gameCompletedTriggered && targetSequence.length > 0) {
      setGameCompletedTriggered(true);
      setTimeout(() => {
        onGameComplete(targetSequence);
      }, 500);
    }
  }, [isComplete, targetSequence, onGameComplete, gameCompletedTriggered]);

  // Handle slot click
  const handleSlotClick = (index: number) => {
    if (gamePhase !== "play" || isComplete || showHelp) return;
    setSelectedSlot(index);
  };

  // Handle image selection from dialog
  const handleImageSelect = useCallback((image: SequenceImage) => {
    if (selectedSlot === null) return;
    
    const correctImage = targetSequence[selectedSlot];
    
    if (image.id === correctImage?.id) {
      // Correct selection
      setPlacedImages(prev => {
        const newPlaced = [...prev];
        newPlaced[selectedSlot] = image;
        return newPlaced;
      });
    }
    // Wrong selection - just close dialog (could add shake animation)
    
    setSelectedSlot(null);
  }, [selectedSlot, targetSequence]);

  // Handle help button
  const handleHelp = () => {
    if (helpUsed || showHelp || gamePhase !== "play") return;
    setShowHelp(true);
    setHelpUsed(true);
  };

  // Calculate item size for mobile
  const itemSize = useMemo(() => {
    if (!isLandscape || windowSize.width === 0) return undefined;
    const columns = 4;
    const rows = 2;
    const gap = 8;
    const PADDING = 8;
    const TEXT_HEIGHT = 60;
    
    const availableWidth = windowSize.width - PADDING * 2;
    const availableHeight = windowSize.height - PADDING * 2 - TEXT_HEIGHT;
    
    const sizeByWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns);
    const sizeByHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows);
    
    return Math.floor(Math.min(sizeByWidth, sizeByHeight) * 0.9);
  }, [isLandscape, windowSize]);

  const gridWidth = itemSize ? 4 * itemSize + 8 * 3 : 0;

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

  if (isLandscape && !itemSize) return null;

  const showTargetRow = gamePhase === "memorize" || showHelp;

  return (
    <div 
      className={`w-full mx-auto ${isLandscape ? 'h-full flex flex-col items-center justify-center' : 'max-w-4xl space-y-2 md:space-y-8 px-2 md:px-0'}`}
      style={{ touchAction: 'none' }}
    >
      {/* Target Sequence - Top Row */}
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
            <div
              key={`target-${image.id}`}
              className={cn(
                "relative rounded-lg overflow-hidden transition-all duration-300",
                isLandscape ? "" : "aspect-square"
              )}
              style={itemSize ? { width: itemSize, height: itemSize } : {}}
            >
              {showTargetRow ? (
                <>
                  <img
                    src={image.image_url || ''}
                    alt={image.word || ''}
                    className="w-full h-full object-contain bg-white/90 p-1"
                    draggable={false}
                  />
                  {/* Countdown or help countdown overlay */}
                  {(gamePhase === "memorize" || showHelp) && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="text-white font-bold text-lg drop-shadow-lg">
                        {showHelp ? helpCountdown : (gamePhase === "memorize" ? countdown : "")}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-400/50 flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Middle section - countdown/instructions */}
      <div className={`text-center ${isLandscape ? 'py-1' : 'py-1 md:py-0'}`}>
        {gamePhase === "memorize" ? (
          <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
            ZAPOMNI SI VRSTNI RED! ({countdown})
          </h3>
        ) : isComplete ? (
          <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
            ✨ ČESTITAM! ✨
          </h3>
        ) : (
          <>
            <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
              KLIKNI NA POLJE IN IZBERI PRAVILNO SLIKO
            </h3>
            {!isLandscape && (
              <p className="text-xs md:text-base text-white/90 drop-shadow uppercase">
                POSTAVI SLIKE V PRAVILNI VRSTNI RED
              </p>
            )}
          </>
        )}
      </div>

      {/* Current Sequence - Bottom Row (Clickable slots) */}
      <div className="relative">
        <div 
          className={`bg-white/30 backdrop-blur-sm rounded-xl border-3 border-orange-400 ${isLandscape ? 'flex justify-center gap-2 p-2' : 'grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6'}`}
          style={isLandscape && itemSize ? { width: gridWidth } : {}}
        >
          {placedImages.map((image, index) => (
            <button
              key={`slot-${index}`}
              onClick={() => handleSlotClick(index)}
              disabled={image !== null || gamePhase === "memorize" || isComplete || showHelp}
              className={cn(
                "relative rounded-lg overflow-hidden transition-all duration-200",
                isLandscape ? "" : "aspect-square",
                image === null && gamePhase === "play" && !isComplete && !showHelp
                  ? "bg-white/50 border-2 border-dashed border-orange-400 hover:bg-white/70 hover:border-orange-500 cursor-pointer animate-pulse"
                  : "bg-white/90"
              )}
              style={itemSize ? { width: itemSize, height: itemSize } : {}}
            >
              {image ? (
                <img
                  src={image.image_url || ''}
                  alt={image.word || ''}
                  className="w-full h-full object-contain p-1"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl md:text-4xl text-orange-400/50">?</span>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Hand icon for empty slots */}
        {!isComplete && gamePhase === "play" && !showHelp && placedImages.some(img => img === null) && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-10 ${isLandscape ? '-bottom-2' : '-bottom-3 md:-bottom-4'}`}>
            <div className={`bg-orange-500 rounded-lg shadow-lg border-2 border-orange-600 animate-bounce ${isLandscape ? 'p-1' : 'p-1.5 md:p-2'}`}>
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

      {/* Help button - only in play phase */}
      {gamePhase === "play" && !isComplete && !helpUsed && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleHelp}
            disabled={showHelp}
            className="rounded-full w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg border-2 border-white/50"
            size="icon"
          >
            <Eye className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Completion message */}
      {isComplete && !isLandscape && (
        <div className="text-center py-2 md:py-4">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-white/30">
            <span className="text-lg md:text-2xl">🎉</span>
            <span className="text-sm md:text-base font-semibold drop-shadow uppercase">IGRA JE KONČANA!</span>
            <span className="text-lg md:text-2xl">🎉</span>
          </div>
        </div>
      )}

      {/* Image Selection Dialog */}
      <SequenceImageSelectionDialog
        isOpen={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        images={shuffledImagesForSelection}
        onSelect={handleImageSelect}
        slotIndex={selectedSlot ?? 0}
      />
    </div>
  );
};
