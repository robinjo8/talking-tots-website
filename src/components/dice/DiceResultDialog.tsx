import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(5);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [starClaimed, setStarClaimed] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setIsRecording(false);
      setRecordingTimeLeft(5);
      setHasRecorded(false);
      setStarClaimed(false);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const playSequence = useCallback(async () => {
    if (isPlaying || !bitjeWord || !povedekWord || !predmetWord) return;
    
    setIsPlaying(true);
    
    const words = [bitjeWord, povedekWord, predmetWord];
    
    for (const word of words) {
      await new Promise<void>((resolve) => {
        const audio = new Audio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
        audioRef.current = audio;
        
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
      
      // Small pause between words
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsPlaying(false);
  }, [isPlaying, bitjeWord, povedekWord, predmetWord]);

  const startRecording = useCallback(() => {
    if (isRecording) return;
    
    setIsRecording(true);
    setRecordingTimeLeft(5);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
          }
          setIsRecording(false);
          setHasRecorded(true);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRecording]);

  const handleClaimStar = useCallback(() => {
    setStarClaimed(true);
    onRecordComplete();
    
    // Close dialog after short delay
    setTimeout(() => {
      onClose();
    }, 500);
  }, [onRecordComplete, onClose]);

  if (!bitjeWord || !povedekWord || !predmetWord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white rounded-3xl border-4 border-app-orange max-w-lg mx-auto p-6">
        <div className="text-center space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800">
            Tvoja smešna poved:
          </h2>
          
          {/* Three images in a row */}
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={`${SUPABASE_URL}/slike/${bitjeWord.image}`}
                  alt={bitjeWord.word}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">{bitjeWord.word}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={`${SUPABASE_URL}/slike/${povedekWord.image}`}
                  alt={povedekWord.word}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">{povedekWord.word}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={`${SUPABASE_URL}/slike/${predmetWord.image}`}
                  alt={predmetWord.word}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">{predmetWord.word}</span>
            </div>
          </div>
          
          {/* Sentence text */}
          <p className="text-xl font-semibold text-gray-800">
            "{bitjeWord.word} {povedekWord.word} {predmetWord.word}"
          </p>
          
          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            {/* Play button */}
            <Button
              onClick={playSequence}
              disabled={isPlaying || isRecording}
              className="flex items-center gap-2 bg-app-blue hover:bg-app-blue/90 text-white px-6 py-3 rounded-xl"
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying ? 'Predvajam...' : 'Predvajaj'}
            </Button>
            
            {/* Record button */}
            <Button
              onClick={startRecording}
              disabled={isRecording || isPlaying || hasRecorded}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : hasRecorded 
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-app-orange hover:bg-app-orange/90'
              } text-white`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording 
                ? `Snemam... ${recordingTimeLeft}s` 
                : hasRecorded 
                  ? 'Posneto!' 
                  : 'Snemaj'}
            </Button>
          </div>
          
          {/* Continue / Claim star button */}
          {hasRecorded && !starClaimed && (
            <Button
              onClick={handleClaimStar}
              className="w-full bg-gradient-to-r from-app-orange to-app-yellow text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              ⭐ VZEMI ZVEZDICO ⭐
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
