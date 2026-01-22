import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Volume2, Mic, X, Star } from 'lucide-react';
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
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const words = [bitjeWord, povedekWord, predmetWord].filter(Boolean) as MetKockeWord[];

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCompletedRecordings(new Set());
      setRecordingTimeLeft(3);
      setCurrentRecordingIndex(null);
      setStarClaimed(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
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
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const playAudio = useCallback((word: MetKockeWord) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
    audioRef.current.play().catch(console.error);
  }, []);

  const startRecording = useCallback((imageIndex: number) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) return;
    
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
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  }, [completedRecordings, currentRecordingIndex]);

  const handleClose = useCallback(() => {
    const allCompleted = completedRecordings.size === words.length;
    if (allCompleted && !starClaimed) {
      setConfirmDialogConfig({
        title: "Zapri igro",
        description: "Če zapreš igro, ne boš prejel zvezdice. Ali si prepričan?",
        onConfirm: () => {
          setShowConfirmDialog(false);
          onClose();
        }
      });
      setShowConfirmDialog(true);
    } else if (!allCompleted) {
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
  }, [completedRecordings.size, words.length, starClaimed, onClose]);

  const handleClaimStar = useCallback(() => {
    setStarClaimed(true);
    onRecordComplete();
    setTimeout(() => {
      onClose();
    }, 1500);
  }, [onRecordComplete, onClose]);

  const handleImageClick = useCallback((imageIndex: number) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) {
      return;
    }
    startRecording(imageIndex);
  }, [completedRecordings, currentRecordingIndex, startRecording]);

  if (!bitjeWord || !povedekWord || !predmetWord) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bold text-dragon-green text-center text-lg md:text-2xl">
              Odlično!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 md:space-y-4 py-2 md:py-4">
            <p className="text-black text-center uppercase text-xs md:text-sm">
              KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE
            </p>
            
            {/* Three images in a row */}
            <div className="flex justify-center gap-3 md:gap-4">
              {words.map((word, index) => {
                const isRecording = currentRecordingIndex === index;
                const isCompleted = completedRecordings.has(index);
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-1 md:space-y-2">
                    <div 
                      className={`cursor-pointer transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleImageClick(index)}
                    >
                      <div className="relative">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 bg-gray-50 ${
                          isCompleted ? 'border-gray-400 grayscale' : isRecording ? 'border-red-500' : 'border-dragon-green'
                        }`}>
                          <img
                            src={`${SUPABASE_URL}/slike/${word.image}`}
                            alt={word.word}
                            className="w-full h-full object-contain"
                          />
                        </div>
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
                    <span className={`font-medium text-center text-xs md:text-sm ${isCompleted ? 'text-gray-400' : 'text-black'}`}>
                      {word.word.toUpperCase()}
                    </span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(word);
                      }}
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {/* Sentence text */}
            <p className="text-base md:text-lg font-semibold text-gray-800 text-center">
              "{bitjeWord.word} {povedekWord.word} {predmetWord.word}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button onClick={handleClose} variant="outline" className="gap-2 flex-1 max-w-32">
              Zapri
            </Button>
            
            {completedRecordings.size === words.length && !starClaimed ? (
              <Button 
                onClick={handleClaimStar} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-36"
              >
                <Star className="w-4 h-4" />
                Vzemi zvezdico
              </Button>
            ) : (
              <Button onClick={handleClose} className="bg-dragon-green hover:bg-dragon-green/90 gap-2 flex-1 max-w-32">
                <X className="w-4 h-4" />
                Zapri
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
        confirmText="V redu"
        cancelText="Prekliči"
        onConfirm={() => confirmDialogConfig?.onConfirm()}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}
