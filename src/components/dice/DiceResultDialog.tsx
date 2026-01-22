import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Volume2, Star } from 'lucide-react';
import { MetKockeWord } from '@/data/metKockeConfig';

interface DiceResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bitjeWord: MetKockeWord | null;
  povedekWord: MetKockeWord | null;
  predmetWord: MetKockeWord | null;
  onRecordComplete: () => void;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

export function DiceResultDialog({
  isOpen,
  onClose,
  bitjeWord,
  povedekWord,
  predmetWord,
  onRecordComplete,
}: DiceResultDialogProps) {
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);
  
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
      setStarClaimed(false);
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

  const handleClose = useCallback(() => {
    if (!starClaimed) {
      setConfirmDialogConfig({
        title: "ZAPRI IGRO",
        description: "ČE ZAPREŠ IGRO, NE BOŠ PREJEL ZVEZDICE. ALI SI PREPRIČAN?",
        onConfirm: () => {
          setShowConfirmDialog(false);
          onClose();
        }
      });
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  }, [starClaimed, onClose]);

  const handleClaimStar = useCallback(() => {
    setStarClaimed(true);
    onRecordComplete();
    setTimeout(() => {
      onClose();
    }, 1500);
  }, [onRecordComplete, onClose]);

  if (!bitjeWord || !povedekWord || !predmetWord) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
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

            {/* Play button */}
            <div className="flex justify-center">
              <Button
                onClick={playAudioSequence}
                disabled={isPlayingSequence}
                className="bg-green-500 hover:bg-green-600 text-white gap-2 uppercase font-medium"
              >
                <Volume2 className="w-4 h-4" />
                {isPlayingSequence ? "PREDVAJAM..." : "PREDVAJAJ"}
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button onClick={handleClose} variant="outline" className="gap-2 flex-1 max-w-32 uppercase">
              ZAPRI
            </Button>
            
            {!starClaimed ? (
              <Button 
                onClick={handleClaimStar} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-40 uppercase"
              >
                <Star className="w-4 h-4" />
                VZEMI ZVEZDICO
              </Button>
            ) : (
              <Button className="bg-dragon-green hover:bg-dragon-green/90 gap-2 flex-1 max-w-32 uppercase" disabled>
                <Star className="w-4 h-4" />
                PREJETO!
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={confirmDialogConfig?.title || ""}
        description={confirmDialogConfig?.description || ""}
        confirmText="V REDU"
        cancelText="PREKLIČI"
        onConfirm={() => confirmDialogConfig?.onConfirm()}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}
