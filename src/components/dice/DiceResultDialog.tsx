import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const words = [bitjeWord, povedekWord, predmetWord].filter(Boolean) as MetKockeWord[];

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

  // Auto-play audio sequence 1.5 seconds after dialog opens
  useEffect(() => {
    if (isOpen && words.length > 0 && !hasAutoPlayedRef.current) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        hasAutoPlayedRef.current = true;
        playAudioSequence();
      }, 1500);
    }
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
    };
  }, [isOpen, words.length, playAudioSequence]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlayingSequence(false);
      hasAutoPlayedRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
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
    };
  }, []);

  if (!bitjeWord || !povedekWord || !predmetWord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-dragon-green text-center text-lg md:text-2xl uppercase">
            ODLIČNO!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 md:space-y-4 py-2 md:py-4">
          <p className="text-black text-center uppercase text-xs md:text-sm font-medium">
            POSLUŠAJ IN PONOVI BESEDE
          </p>
          
          {/* Three images in a row */}
          <div className="flex justify-center gap-3 md:gap-4">
            {words.map((word, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 md:space-y-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-dragon-green bg-gray-50">
                  <img
                    src={`${SUPABASE_URL}/slike/${word.image}`}
                    alt={word.word}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-center text-xs md:text-sm text-black uppercase">
                  {word.word.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          
          {/* Sentence text */}
          <p className="text-base md:text-lg font-semibold text-gray-800 text-center uppercase">
            "{bitjeWord.word.toUpperCase()} {povedekWord.word.toUpperCase()} {predmetWord.word.toUpperCase()}"
          </p>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={playAudioSequence}
              disabled={isPlayingSequence}
              className="bg-green-500 hover:bg-green-600 text-white gap-2 uppercase font-medium"
            >
              <Volume2 className="w-4 h-4" />
              {isPlayingSequence ? "PREDVAJAM..." : "PREDVAJAJ"}
            </Button>
            
            <Button onClick={onClose} variant="outline" className="gap-2 uppercase">
              ZAPRI
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
