import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, X } from 'lucide-react';
import { MetKockeWord } from '@/data/metKockeConfig';

interface DiceResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bitjeWord: MetKockeWord | null;
  povedekWord: MetKockeWord | null;
  predmetWord: MetKockeWord | null;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

export function DiceResultDialog({
  isOpen,
  onClose,
  bitjeWord,
  povedekWord,
  predmetWord,
}: DiceResultDialogProps) {
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoPlayedRef = useRef(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const words = [bitjeWord, povedekWord, predmetWord].filter(Boolean) as MetKockeWord[];

  // Start simulated recording with 5 second countdown
  const startRecording = useCallback(() => {
    if (isRecording) return;
    
    setIsRecording(true);
    setRecordingTimeLeft(5);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setIsRecording(false);
          // Close dialog after recording finishes
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRecording, onClose]);

  // Play audio sequence for all three words
  const playAudioSequence = useCallback(async () => {
    if (isPlayingSequence || words.length === 0) return;
    
    setIsPlayingSequence(true);
    
    for (const word of words) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      await new Promise<void>((resolve) => {
        audioRef.current = new Audio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
        audioRef.current.onended = () => resolve();
        audioRef.current.onerror = () => resolve();
        audioRef.current.play().catch(() => resolve());
      });
    }
    
    setIsPlayingSequence(false);
  }, [words, isPlayingSequence]);

  // Auto-play audio sequence immediately when dialog opens (no delay, no gaps)
  useEffect(() => {
    if (isOpen && words.length > 0 && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true;
      playAudioSequence();
    }
  }, [isOpen, words.length, playAudioSequence]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlayingSequence(false);
      setIsRecording(false);
      setRecordingTimeLeft(0);
      hasAutoPlayedRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (!bitjeWord || !povedekWord || !predmetWord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-bold text-dragon-green text-center text-base sm:text-lg md:text-2xl uppercase">
            ODLIČNO!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 sm:space-y-3 md:space-y-4 py-1 sm:py-2 md:py-4">
          <p className="text-black text-center uppercase text-[10px] sm:text-xs md:text-sm font-medium">
            POSLUŠAJ IN PONOVI POVED
          </p>
          
          {/* Three images in a row */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {words.map((word, index) => (
              <div key={index} className="flex flex-col items-center space-y-0.5 sm:space-y-1 md:space-y-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-dragon-green bg-gray-50">
                  <img
                    src={`${SUPABASE_URL}/slike/${word.image}`}
                    alt={word.word}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-center text-[10px] sm:text-xs md:text-sm text-black uppercase">
                  {word.word.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          
          {/* Sentence text */}
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center uppercase">
            "{bitjeWord.word.toUpperCase()} {povedekWord.word.toUpperCase()} {predmetWord.word.toUpperCase()}"
          </p>

          {/* Action buttons */}
          <div className="flex justify-center gap-2 sm:gap-3 pt-2">
            <Button
              onClick={playAudioSequence}
              disabled={isPlayingSequence || isRecording}
              className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-1 sm:gap-2 uppercase font-medium h-9 sm:h-10 w-28 sm:w-32 text-xs sm:text-sm"
            >
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
              {isPlayingSequence ? "..." : "PREDVAJAJ"}
            </Button>
            
            {/* PONOVI button with countdown */}
            <Button
              onClick={startRecording}
              disabled={isRecording || isPlayingSequence}
              className="relative bg-app-orange hover:bg-app-orange/90 text-white gap-1 sm:gap-2 uppercase font-medium h-9 sm:h-10 w-28 sm:w-32 text-xs sm:text-sm"
            >
              <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
              {isRecording ? "..." : "PONOVI"}
              {isRecording && (
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {recordingTimeLeft}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
