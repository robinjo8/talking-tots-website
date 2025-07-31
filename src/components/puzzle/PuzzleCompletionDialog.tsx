import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const { playAudio } = useAudioPlayback();

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke/${completedImage.filename}`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/R/${completedImage.word.toLowerCase()}.mp3`;

  // Play audio automatically when dialog opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        playAudio(audioUrl);
      }, 500); // Small delay to ensure dialog is fully rendered

      return () => clearTimeout(timer);
    }
  }, [isOpen, audioUrl, playAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await saveRecording(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);
      toast("Snemanje se je začelo...");

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-stop after 3 seconds
      setTimeout(() => {
        clearInterval(countdownInterval);
        if (recorder && recorder.state === 'recording') {
          stopRecording();
        }
      }, 3000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Napaka pri dostopu do mikrofona");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      toast("Snemanje končano");
    }
  };

  const saveRecording = async (audioBlob: Blob) => {
    try {
      const fileName = `recording_${completedImage.word.toLowerCase()}_${Date.now()}.webm`;
      
      const { error } = await supabase.storage
        .from('audio-besede')
        .upload(`recordings/${fileName}`, audioBlob, {
          contentType: 'audio/webm'
        });

      if (error) {
        throw error;
      }

      toast("Posnetek je bil shranjen!");
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error("Napaka pri shranjevanju posnetka");
    }
  };

  const handlePlayAudio = () => {
    playAudio(audioUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <div className="flex flex-col items-center gap-6 p-6">
          <h2 className="text-2xl font-bold text-center">Odlično!</h2>
          
          {/* Completed Image */}
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-primary">
            <img 
              src={imageUrl} 
              alt={completedImage.word}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Word Label */}
          <h3 className="text-xl font-semibold">{completedImage.word}</h3>

          {/* Audio Controls */}
          <div className="flex gap-4">
            <Button
              onClick={handlePlayAudio}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Volume2 className="w-5 h-5" />
              Predvajaj
            </Button>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              className={`gap-2 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-dragon-green hover:bg-dragon-green/90 text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
              {isRecording ? `Ustavi (${recordingTimeLeft}s)` : 'Posnemi se'}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="mt-4"
          >
            Zapri
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}