import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Volume2, Mic } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface WheelSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: {
    filename: string;
    word: string;
    audio?: string;
  };
  onRecordComplete: () => void;
}

export const WheelSuccessDialog: React.FC<WheelSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage,
  onRecordComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [justRecorded, setJustRecorded] = useState(false);

  const { playAudio } = useAudioPlayback();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const stopRecordingRef = useRef<() => void>(() => {});
  const prevIsOpenRef = useRef(false);

  const cleanupCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const stopRecordingNow = useCallback(() => {
    cleanupCountdown();
    setIsRecording(false);
    setRecordingTimeLeft(3);
    setJustRecorded(true);

    setTimeout(() => {
      onRecordComplete();
      // Auto-close after recording
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    }, 0);
  }, [cleanupCountdown, onRecordComplete, onOpenChange]);

  useEffect(() => {
    stopRecordingRef.current = stopRecordingNow;
  }, [stopRecordingNow]);

  // Auto-play audio when dialog opens
  useEffect(() => {
    const dialogJustOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (dialogJustOpened && completedImage) {
      const normalizedWord = completedImage.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
      playAudio(audioUrl);

      setJustRecorded(false);
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

  const startRecording = () => {
    if (justRecorded) return;
    cleanupCountdown();
    setIsRecording(true);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
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

  const handlePlayAudio = () => {
    const normalizedWord = completedImage.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
    audioFilename = audioFilename.replace(/1\.m4a$/, '.m4a');
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const handleImageClick = () => {
    if (!isRecording && !justRecorded) {
      startRecording();
    }
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${completedImage.filename}`;

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
