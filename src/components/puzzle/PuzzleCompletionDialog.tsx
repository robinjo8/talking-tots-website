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

  // Play audio automatically when dialog opens and reset recording state
  useEffect(() => {
    if (isOpen) {
      // Reset recording state when dialog opens
      setIsRecording(false);
      setRecordingTimeLeft(3);
      setMediaRecorder(null);
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }

      const timer = setTimeout(() => {
        playAudio(audioUrl);
      }, 500); // Small delay to ensure dialog is fully rendered

      return () => clearTimeout(timer);
    }
  }, [isOpen, audioUrl, playAudio, audioStream]);

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

      // Clean countdown that auto-stops at 0
      let timeLeft = 3;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setRecordingTimeLeft(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          // Auto-stop recording when countdown reaches 0
          if (recorder && recorder.state === 'recording') {
            recorder.stop();
          }
          setIsRecording(false);
          toast("Snemanje končano");
        }
      }, 1000);

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
      // Normalize word to remove special characters (č, š, ž, etc.)
      const normalizedWord = completedImage.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]/g, '-'); // Replace non-alphanumeric with dash
      const fileName = `recording_${normalizedWord}_${Date.now()}.webm`;
      
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