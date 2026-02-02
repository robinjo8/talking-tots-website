import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, Star } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { ProgressCircles } from './ProgressCircles';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface WheelSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: {
    filename: string;
    word: string;
    audio?: string;
  };
  pronunciationCount: number; // 0, 1, 2, or 3
  onRecordComplete: () => void; // Called when user records successfully
  onStarClaimed: () => void;
}

export const WheelSuccessDialog: React.FC<WheelSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage,
  pronunciationCount,
  onRecordComplete,
  onStarClaimed,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [starClaimed, setStarClaimed] = useState(false);
  const [justRecorded, setJustRecorded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { playAudio } = useAudioPlayback();

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Avoid stale-closure when stopping recording from setInterval.
  const stopRecordingRef = useRef<() => void>(() => {});
  
  // Track previous isOpen to detect dialog opening (false -> true)
  const prevIsOpenRef = useRef(false);
  
  // Store pronunciation count when dialog opens to avoid double counting
  const initialPronunciationCountRef = useRef(pronunciationCount);

  const canClaimStar = pronunciationCount >= 3;

  const cleanupCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const stopRecordingNow = useCallback(() => {
    console.log('[WheelSuccessDialog] stopRecordingNow', {
      word: completedImage?.word,
      pronunciationCount,
    });

    cleanupCountdown();

    setIsRecording(false);
    setRecordingTimeLeft(3);

    // This is the key UI state: after EVERY pronunciation in this dialog,
    // we gray out the image and show "NADALJUJ".
    console.log('[WheelSuccessDialog] setJustRecorded(true)');
    setJustRecorded(true);

    // Defer parent progress update so this component re-renders once with justRecorded=true
    // before any parent-driven prop changes can remount/reset the dialog.
    setTimeout(() => {
      console.log('[WheelSuccessDialog] onRecordComplete()');
      onRecordComplete();
      
      // Auto-close dialog after recording (only if not at 3/3 - star claim stays open)
      const newCount = initialPronunciationCountRef.current + 1;
      if (newCount < 3) {
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      }
    }, 0);
  }, [cleanupCountdown, onRecordComplete, onOpenChange, completedImage?.word, pronunciationCount]);

  useEffect(() => {
    stopRecordingRef.current = stopRecordingNow;
  }, [stopRecordingNow]);

  // Auto-play audio ONLY when dialog OPENS (false -> true)
  // This prevents resetting justRecorded when completedImage prop changes due to pronunciationCount updates
  useEffect(() => {
    const dialogJustOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    
    if (dialogJustOpened && completedImage) {
      // Store the pronunciation count at the moment dialog opens
      initialPronunciationCountRef.current = pronunciationCount;
      
      const normalizedWord = completedImage.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
      playAudio(audioUrl);

      // Reset states ONLY when dialog first opens, not on every completedImage change
      setJustRecorded(false);
      setStarClaimed(false);
    }
  }, [isOpen, completedImage, playAudio]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setRecordingTimeLeft(3);
      setJustRecorded(false);
      cleanupCountdown();
    }
  }, [isOpen, cleanupCountdown]);

  // Simulated recording - visual countdown only, no actual audio recording
  const startRecording = () => {
    console.log('[WheelSuccessDialog] startRecording (simulated)', {
      isOpen,
      word: completedImage?.word,
      justRecorded,
      isRecording,
      pronunciationCount,
    });

    if (justRecorded) return; // Prevent multiple recordings in same dialog session

    // Reset any prior remnants
    cleanupCountdown();

    setIsRecording(true);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft((prev) => {
        const next = prev - 1;
        console.log('[WheelSuccessDialog] countdown tick', { prev, next });
        if (next <= 0) {
          console.log('[WheelSuccessDialog] countdown reached 0 -> stopping');
          cleanupCountdown();
          setTimeout(() => stopRecordingRef.current(), 0);
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleClaimStar = () => {
    console.log('[WheelSuccessDialog] claim star', { word: completedImage?.word, pronunciationCount });
    setStarClaimed(true);
    onStarClaimed();
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  };

  const handlePlayAudio = () => {
    const normalizedWord = completedImage.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
    // Remove trailing "1" before .m4a if present (e.g., "cekin1.m4a" → "cekin.m4a")
    audioFilename = audioFilename.replace(/1\.m4a$/, '.m4a');
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const handleImageClick = () => {
    console.log('[WheelSuccessDialog] image click', { isRecording, justRecorded });
    if (!isRecording && !justRecorded) {
      startRecording();
    }
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${completedImage.filename}`;

  // Display count uses stored initial count + 1 when just recorded to avoid double counting
  const displayCount = justRecorded 
    ? Math.min(initialPronunciationCountRef.current + 1, 3) 
    : pronunciationCount;
  const showClaimButton = displayCount >= 3;

  const handleBravoClose = () => {
    if (!starClaimed) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  // If star can be claimed, show simple Bingo-style congratulations dialog
  if (showClaimButton) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={handleBravoClose}>
          <DialogContent 
            className="sm:max-w-md" 
            onPointerDownOutside={(e) => e.preventDefault()}
          >
          <div className="space-y-6 py-6 flex flex-col items-center">
            <h1 className="text-5xl font-bold text-dragon-green text-center">
              BRAVO!
            </h1>
            
            <img
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
              alt="Zmajček"
              className="w-48 h-48 object-contain"
            />
            
            <Button
              onClick={handleClaimStar}
              disabled={starClaimed}
              className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8 text-lg"
            >
              ⭐ VZEMI ZVEZDICO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="OPOZORILO"
        description="ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
        confirmText="DA"
        cancelText="NE"
        onConfirm={() => {
          setShowConfirmDialog(false);
          onOpenChange(false);
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] sm:max-w-lg overflow-y-auto p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-4 py-1 sm:py-4">
          <h2 className="text-lg sm:text-2xl font-bold text-dragon-green text-center uppercase">
            ODLIČNO!
          </h2>

          <p className="text-xs sm:text-sm text-black text-center">KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO</p>

          <div className="flex justify-center">
            <div
              className={`flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-all ${
                justRecorded ? 'opacity-70 cursor-not-allowed grayscale' : 'hover:scale-105'
              }`}
              onClick={handleImageClick}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={completedImage.word}
                  className={`w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg border-2 ${
                    justRecorded
                      ? 'border-gray-400'
                      : isRecording
                        ? 'border-red-500'
                        : 'border-dragon-green'
                  }`}
                />

                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                )}

                {isRecording && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold">
                    {recordingTimeLeft}
                  </div>
                )}
              </div>

              <span className="text-base sm:text-lg font-medium text-center text-black">{completedImage.word.toUpperCase()}</span>
            </div>
          </div>

          {/* Progress circles */}
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <ProgressCircles count={displayCount} size="lg" animate={false} />
          </div>

          {/* Audio playback button */}
          <div className="flex justify-center">
            <button
              onClick={handlePlayAudio}
              className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
              aria-label="Predvajaj besedo"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
