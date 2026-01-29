import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SequenceImage } from "@/hooks/useSequenceGame";
import { SequenceImageSelectionDialog } from "./SequenceImageSelectionDialog";
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SequenceGame56BaseProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
  tableName: string;
  queryKey: string;
}

type GamePhase = "pre-countdown" | "memorize" | "select" | "arrange";
type SlotStatus = "empty" | "correct" | "wrong-position" | "wrong";

const PRE_COUNTDOWN_SECONDS = 5;
const MEMORIZE_COUNTDOWN_SECONDS = 10;
const HELP_USES = 1;

export const SequenceGame56Base = ({ onGameComplete, isLandscape = false, tableName, queryKey }: SequenceGame56BaseProps) => {
  const { data: allImages, isLoading } = useQuery({
    queryKey: ["sequenceImages56", queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .limit(20);
      
      if (error) {
        console.error("Error fetching sequence images:", error);
        throw error;
      }
      
      return data as unknown as SequenceImage[];
    }
  });

  const [targetSequence, setTargetSequence] = useState<SequenceImage[]>([]);
  const [selectionImages, setSelectionImages] = useState<SequenceImage[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>("pre-countdown");
  const [preCountdown, setPreCountdown] = useState(PRE_COUNTDOWN_SECONDS);
  const [countdown, setCountdown] = useState(MEMORIZE_COUNTDOWN_SECONDS);
  const [placedImages, setPlacedImages] = useState<(SequenceImage | null)[]>([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [gameCompletedTriggered, setGameCompletedTriggered] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpCountdown, setHelpCountdown] = useState(5);
  const [helpUsesLeft, setHelpUsesLeft] = useState(HELP_USES);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!allImages || allImages.length < 8) return;
    if (targetSequence.length > 0) return;

    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    const target = shuffled.slice(0, 4);
    const extraImages = shuffled.slice(4, 8);
    
    setTargetSequence(target);
    setSelectionImages([...target, ...extraImages].sort(() => Math.random() - 0.5));
  }, [allImages, targetSequence.length]);

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

  // Pre-countdown timer (red number, no images)
  useEffect(() => {
    if (gamePhase !== "pre-countdown" || targetSequence.length === 0) return;
    if (preCountdown <= 0) {
      setGamePhase("memorize");
      return;
    }
    const timer = setTimeout(() => setPreCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [preCountdown, gamePhase, targetSequence]);

  // Memorize countdown timer
  useEffect(() => {
    if (gamePhase !== "memorize" || targetSequence.length === 0) return;
    if (countdown <= 0) {
      setGamePhase("select");
      return;
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, gamePhase, targetSequence]);

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

  const allCorrectSelected = useMemo(() => {
    const placedIds = placedImages.filter(img => img !== null).map(img => img!.id);
    const targetIds = targetSequence.map(img => img.id);
    return targetIds.every(id => placedIds.includes(id));
  }, [placedImages, targetSequence]);

  useEffect(() => {
    if (gamePhase === "select" && allCorrectSelected) {
      setGamePhase("arrange");
    }
  }, [allCorrectSelected, gamePhase]);

  useEffect(() => {
    if (gamePhase !== "arrange" || placedImages.some(img => img === null)) return;
    const allCorrect = placedImages.every((img, index) => 
      img?.id === targetSequence[index]?.id
    );
    if (allCorrect && !isComplete) {
      setIsComplete(true);
    }
  }, [placedImages, targetSequence, gamePhase, isComplete]);

  useEffect(() => {
    if (isComplete && !gameCompletedTriggered && targetSequence.length > 0) {
      setGameCompletedTriggered(true);
      setTimeout(() => {
        onGameComplete(targetSequence);
      }, 500);
    }
  }, [isComplete, targetSequence, onGameComplete, gameCompletedTriggered]);

  const getSlotStatus = useCallback((image: SequenceImage | null, index: number): SlotStatus => {
    if (!image) return "empty";
    const isInTarget = targetSequence.some(t => t.id === image.id);
    if (!isInTarget) return "wrong";
    const isCorrectPosition = targetSequence[index]?.id === image.id;
    if (isCorrectPosition) return "correct";
    return "wrong-position";
  }, [targetSequence]);

  const handleSlotClick = (index: number) => {
    if (gamePhase !== "select" || isComplete || showHelp) return;
    setSelectedSlot(index);
  };

  const handleImageSelect = useCallback((image: SequenceImage) => {
    if (selectedSlot === null) return;
    const existingIndex = placedImages.findIndex(img => img?.id === image.id);
    setPlacedImages(prev => {
      const newPlaced = [...prev];
      if (existingIndex !== -1 && existingIndex !== selectedSlot) {
        newPlaced[existingIndex] = prev[selectedSlot];
      }
      newPlaced[selectedSlot] = image;
      return newPlaced;
    });
    setSelectedSlot(null);
  }, [selectedSlot, placedImages]);

  const handleMoveImage = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex > 3) return;
    setPlacedImages(prev => {
      const newPlaced = [...prev];
      [newPlaced[fromIndex], newPlaced[toIndex]] = [newPlaced[toIndex], newPlaced[fromIndex]];
      return newPlaced;
    });
  };

  const handleHelp = () => {
    if (helpUsesLeft <= 0 || showHelp || gamePhase === "memorize") return;
    setShowHelp(true);
    setHelpUsesLeft(prev => prev - 1);
  };

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
    return Math.floor(Math.min(sizeByWidth, sizeByHeight) * 0.85);
  }, [isLandscape, windowSize]);

  const gridWidth = itemSize ? 4 * itemSize + 8 * 3 : 0;

  const getSlotBorderClass = (status: SlotStatus) => {
    switch (status) {
      case "correct": return "border-emerald-500 bg-emerald-200 border-4 shadow-[0_0_12px_rgba(16,185,129,0.6)]";
      case "wrong-position": return "border-amber-400 bg-amber-200 border-4 shadow-[0_0_12px_rgba(251,191,36,0.6)]";
      case "wrong": return "border-rose-500 bg-rose-200 border-4 shadow-[0_0_12px_rgba(244,63,94,0.6)]";
      default: return "border-orange-400 bg-white/50";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (targetSequence.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white/80 drop-shadow uppercase">NI NA VOLJO SLIK ZA TO IGRO.</p>
      </div>
    );
  }

  if (isLandscape && !itemSize) return null;

  const showTargetRow = gamePhase === "memorize" || showHelp;

  // Pre-countdown phase - show only red countdown, no game elements
  if (gamePhase === "pre-countdown") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg uppercase text-center">
          PRIPRAVI SE NA IGRO ZAPOREDJA!
        </h3>
        <div className="bg-white/20 backdrop-blur-sm rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center border-4 border-red-400/50">
          <span className="text-5xl md:text-7xl font-bold text-red-500 drop-shadow-lg">{preCountdown}</span>
        </div>
      </div>
    );
  }

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
                  {showHelp && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="text-white font-bold text-lg drop-shadow-lg">
                        {helpCountdown}
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

      {/* Mobile countdown */}
      {gamePhase === "memorize" && isLandscape && (
        <div className="fixed top-2 right-2 z-50">
          <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border-2 border-white/30">
            <span className="text-2xl font-bold text-white drop-shadow-lg">{countdown}</span>
          </div>
        </div>
      )}

      {/* Middle section */}
      <div className={`text-center ${isLandscape ? 'py-1' : 'py-1 md:py-0'}`}>
        {gamePhase === "memorize" ? (
          <div className="flex flex-col items-center gap-2">
            <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
              ZAPOMNI SI VRSTNI RED!
            </h3>
            {!isLandscape && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border-2 border-white/30">
                <span className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{countdown}</span>
              </div>
            )}
          </div>
        ) : isComplete ? null : gamePhase === "arrange" ? (
          <>
            <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
              UREDI SLIKE V PRAVILNI VRSTNI RED
            </h3>
            {!isLandscape && (
              <p className="text-xs md:text-base text-white/90 drop-shadow uppercase">
                PREMIKAJ SLIKE LEVO IN DESNO
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className={`font-bold text-white drop-shadow-lg uppercase ${isLandscape ? 'text-sm mb-0' : 'text-base md:text-2xl mb-0.5 md:mb-2'}`}>
              KLIKNI NA POLJE IN IZBERI PRAVILNO SLIKO
            </h3>
            {!isLandscape && (
              <p className="text-xs md:text-base text-white/90 drop-shadow uppercase">
                IZBERI 4 PRAVILNE SLIKE
              </p>
            )}
          </>
        )}
      </div>

      {/* Bottom Row - Clickable slots */}
      <div className="relative">
        <div 
          className={cn(
            "backdrop-blur-sm rounded-xl border-3 transition-all duration-300",
            isLandscape ? 'flex justify-center gap-2 p-2' : 'grid grid-cols-4 gap-1.5 md:gap-4 p-2 md:p-6',
            gamePhase !== "memorize" && !isComplete && "animate-glow-border",
            "bg-white/30 border-orange-400"
          )}
          style={isLandscape && itemSize ? { width: gridWidth } : {}}
        >
          {placedImages.map((image, index) => {
            const status = getSlotStatus(image, index);
            
            return (
              <div key={`slot-${index}`} className="relative">
                {gamePhase === "arrange" ? (
                  <div 
                    className={cn(
                      "relative rounded-lg overflow-hidden transition-all duration-200 border-3",
                      isLandscape ? "" : "aspect-square",
                      getSlotBorderClass(status)
                    )}
                    style={itemSize ? { width: itemSize, height: itemSize } : {}}
                  >
                    {image && (
                      <>
                        <img
                          src={image.image_url || ''}
                          alt={image.word || ''}
                          className="w-full h-full object-contain p-1"
                          draggable={false}
                        />
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
                          <button
                            onClick={() => handleMoveImage(index, "left")}
                            disabled={index === 0 || isComplete}
                            className={cn(
                              "p-1 rounded-full bg-orange-500 text-white shadow-md transition-opacity",
                              index === 0 ? "opacity-30" : "hover:bg-orange-600"
                            )}
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveImage(index, "right")}
                            disabled={index === 3 || isComplete}
                            className={cn(
                              "p-1 rounded-full bg-orange-500 text-white shadow-md transition-opacity",
                              index === 3 ? "opacity-30" : "hover:bg-orange-600"
                            )}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSlotClick(index)}
                    disabled={gamePhase === "memorize" || isComplete || showHelp}
                    className={cn(
                      "relative rounded-lg overflow-hidden transition-all duration-200 w-full border-3",
                      isLandscape ? "" : "aspect-square",
                      image === null 
                        ? "bg-white/50 border-dashed border-orange-400 hover:bg-white/70 hover:border-orange-500 cursor-pointer"
                        : getSlotBorderClass(status)
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
                        <span className={`font-bold text-orange-400/70 ${isLandscape ? 'text-lg' : 'text-2xl md:text-4xl'}`}>
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Help button */}
      {gamePhase !== "memorize" && !isComplete && (
        <div className={`flex justify-center ${isLandscape ? 'mt-1' : 'mt-2 md:mt-4'}`}>
          <Button
            onClick={handleHelp}
            disabled={helpUsesLeft <= 0 || showHelp}
            variant="outline"
            className={cn(
              "bg-white/20 border-white/40 text-white hover:bg-white/30",
              isLandscape ? 'px-3 py-1 text-xs' : 'px-4 py-2',
              (helpUsesLeft <= 0 || showHelp) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Eye className={`mr-2 ${isLandscape ? 'w-3 h-3' : 'w-4 h-4'}`} />
            POMOČ ({helpUsesLeft}/3)
          </Button>
        </div>
      )}

      {/* Image selection dialog */}
      <SequenceImageSelectionDialog
        isOpen={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        images={selectionImages}
        onSelect={handleImageSelect}
        slotIndex={selectedSlot ?? 0}
      />
    </div>
  );
};
