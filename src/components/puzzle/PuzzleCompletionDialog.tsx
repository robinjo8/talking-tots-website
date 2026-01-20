import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface PuzzleCompletionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: {
    filename: string;
    word: string;
  };
}

export function PuzzleCompletionDialog({ 
  isOpen, 
  onOpenChange, 
  completedImage 
}: PuzzleCompletionDialogProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const { playAudio } = useAudioPlayback();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${completedImage.filename}`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/R/${completedImage.word.toLowerCase()}.mp3`;

  // Play audio automatically when dialog opens and reset recording state
  useEffect(() => {
    if (isOpen) {
      // Reset recording state when dialog opens
      setIsRecording(false);
      setRecordingTimeLeft(3);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      const timer = setTimeout(() => {
        playAudio(audioUrl);
      }, 500); // Small delay to ensure dialog is fully rendered

      return () => clearTimeout(timer);
    }
  }, [isOpen, audioUrl, playAudio]);

  // Simulated recording - visual countdown only, no actual audio recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setIsRecording(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePlayAudio = () => {
    playAudio(audioUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold text-dragon-green text-center">Odlično!</h2>
          
          <p className="text-sm text-black text-center">
            KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
          </p>
          
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dragon-green">
                <img 
                  src={imageUrl} 
                  alt={completedImage.word}
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-lg font-medium text-center text-black">
                {completedImage.word}
              </span>
            </div>
          </div>

          {/* Audio playback button */}
          <div className="flex justify-center">
            <Button
              onClick={handlePlayAudio}
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}