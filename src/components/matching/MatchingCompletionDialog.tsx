import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Mic, X, Volume2 } from "lucide-react";
import { MatchingGameImage } from "@/data/matchingGameData";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface MatchingCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: MatchingGameImage[];
  onStarClaimed?: () => void;
  onNewGame?: () => void;
  instructionText?: string;
  autoPlayAudio?: boolean;
  isMobileLandscape?: boolean;
}

export const MatchingCompletionDialog: React.FC<MatchingCompletionDialogProps> = ({
  isOpen,
  onClose,
  images,
  onStarClaimed,
  onNewGame,
  instructionText = "KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE.",
  autoPlayAudio = false,
  isMobileLandscape = false
}) => {
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBravoDialog, setShowBravoDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);
  const {
    playAudio
  } = useAudioPlayback();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoTransitionedRef = useRef(false);

  // Auto-transition to BRAVO dialog when all recordings complete
  useEffect(() => {
    if (images.length > 0 && completedRecordings.size === images.length && !hasAutoTransitionedRef.current) {
      hasAutoTransitionedRef.current = true;
      // Small delay for smooth transition
      setTimeout(() => {
        setShowBravoDialog(true);
        // NOTE: onStarClaimed is called when user clicks "VZEMI ZVEZDICO" button, not here
      }, 500);
    }
  }, [completedRecordings.size, images.length]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      setCompletedRecordings(new Set());
      setRecordingTimeLeft(3);
      setCurrentRecordingIndex(null);
      setShowBravoDialog(false);
      hasAutoTransitionedRef.current = false;
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
  }, [isOpen]);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && autoPlayAudio && images.length > 0 && !showBravoDialog) {
      const playAudioForImage = async () => {
        try {
          const word = images[0].word;
          const normalizedWord = word
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          const audioFilename = `${normalizedWord}.m4a`;
          const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
          
          const audio = new Audio(audioUrl);
          audio.play().catch(error => {
            console.warn('Auto-play failed:', error);
          });
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      };
      
      setTimeout(playAudioForImage, 300);
    }
  }, [isOpen, autoPlayAudio, images, showBravoDialog]);

  // Simulated recording - visual countdown only
  const startRecording = (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex)) return;
    
    setCurrentRecordingIndex(imageIndex);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setCompletedRecordings(prevCompleted => new Set([...prevCompleted, imageIndex]));
          setCurrentRecordingIndex(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    const allCompleted = completedRecordings.size === images.length;
    if (!allCompleted) {
      setConfirmDialogConfig({
        title: "Zapri okno",
        description: "Ali ste prepričani, da se želite zapreti okno? Niste še končali vseh posnetkov.",
        onConfirm: () => {
          setShowConfirmDialog(false);
          onClose();
        }
      });
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleBravoClose = () => {
    setShowBravoDialog(false);
    onStarClaimed?.(); // Call when user claims the star
    onClose();
  };

  const handleImageClick = (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) {
      return;
    }
    startRecording(imageIndex, word);
  };

  const handlePlayAudio = (image: MatchingGameImage) => {
    let audioUrl: string;
    
    if (image.audio_url) {
      audioUrl = image.audio_url;
    } else {
      // Fallback: generiraj URL iz besede
      let normalizedWord = image.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      // Remove trailing "1" if present
      normalizedWord = normalizedWord.replace(/1$/, '');
      audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${normalizedWord}.m4a`;
    }
    
    playAudio(audioUrl);
  };

  return (
    <>
      {/* Main ODLIČNO dialog - hide when BRAVO is shown */}
      <Dialog open={isOpen && !showBravoDialog} onOpenChange={handleClose}>
        <DialogContent className={isMobileLandscape 
          ? "w-[60vw] h-screen max-h-screen rounded-none flex flex-col justify-between py-4" 
          : "sm:max-w-lg"
        }>
          <DialogHeader className={isMobileLandscape ? "pb-0 flex-shrink-0" : ""}>
            <DialogTitle className={`font-bold text-dragon-green text-center uppercase ${isMobileLandscape ? "text-xl" : "text-lg md:text-2xl"}`}>
              ODLIČNO!
            </DialogTitle>
          </DialogHeader>
          <div className={isMobileLandscape 
            ? "flex-1 flex flex-col justify-center items-center space-y-3 py-2" 
            : "space-y-2 md:space-y-6 py-2 md:py-4"
          }>
            <p className={`text-black text-center uppercase ${isMobileLandscape ? "text-sm" : "text-xs md:text-sm"}`}>{instructionText}</p>
            
            {/* Display images */}
            <div className={images.length === 1 
              ? "flex justify-center" 
              : `flex justify-center flex-wrap gap-2 md:gap-4`
            }>
              {images.map((image, index) => {
                const isRecording = currentRecordingIndex === index;
                const isCompleted = completedRecordings.has(index);
                const isFiveImages = images.length === 5;
                return (
                  <div key={index} className={`flex flex-col items-center ${isMobileLandscape ? "space-y-1" : "space-y-1 md:space-y-2"}`}>
                    <div 
                      className={`cursor-pointer transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleImageClick(index, image.word)}
                    >
                      <div className="relative">
                        <img 
                          src={image.url} 
                          alt={image.word} 
                          className={`object-cover rounded-xl border-2 ${isMobileLandscape 
                            ? isFiveImages ? "w-14 h-14" : "w-16 h-16" 
                            : isFiveImages ? "w-12 h-12 md:w-16 md:h-16" : "w-14 h-14 md:w-20 md:h-20"
                          } ${isCompleted ? 'border-gray-400 grayscale' : isRecording ? 'border-red-500' : 'border-dragon-green'}`} 
                        />
                        {isRecording && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl">
                            <div className="bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                              <Mic className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                          </div>
                        )}
                        {isRecording && (
                          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                            {recordingTimeLeft}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`font-medium text-center ${isMobileLandscape 
                      ? isFiveImages ? "text-[10px]" : "text-xs" 
                      : isFiveImages ? "text-[10px] md:text-xs" : "text-xs md:text-sm"
                    } ${isCompleted ? 'text-gray-400' : 'text-black'}`}>
                      {image.word.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(image);
                      }}
                      className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
                      aria-label="Predvajaj besedo"
                    >
                      <Volume2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons - only ZAPRI, no VZEMI ZVEZDICO */}
          <div className={`flex justify-center flex-shrink-0 ${isMobileLandscape ? "pb-2" : ""}`}>
            <Button onClick={handleClose} variant="outline" className={`gap-2 max-w-32 ${isMobileLandscape ? "h-10" : ""}`}>
              ZAPRI
            </Button>
          </div>
        </DialogContent>
        
        <ConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          title={confirmDialogConfig?.title?.toUpperCase() || ""}
          description={confirmDialogConfig?.description?.toUpperCase() || ""}
          confirmText="V REDU"
          cancelText="PREKLIČI"
          onConfirm={() => confirmDialogConfig?.onConfirm()}
          onCancel={() => setShowConfirmDialog(false)}
        />
      </Dialog>

      {/* BRAVO Dialog with Zmajček */}
      <Dialog open={showBravoDialog} onOpenChange={handleBravoClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-dragon-green drop-shadow-lg">
              BRAVO!
            </h1>
            
            <img 
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp" 
              alt="Zmajček" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
            
            <Button
              onClick={handleBravoClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-8 py-3 h-auto"
            >
              ⭐ VZEMI ZVEZDICO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
