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
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      console.log('Microphone access granted');
      
      setAudioStream(stream);

      // Check supported MIME types
      const supportedTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];
      
      let mimeType = 'audio/webm';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      console.log('Using MIME type:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        console.log('Data available event fired, size:', event.data.size);
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        console.log('MediaRecorder started');
      };

      recorder.onstop = async () => {
        console.log('MediaRecorder stopped, chunks:', chunks.length);
        
        // Stop all tracks
        stream.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        setAudioStream(null);
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: mimeType });
          console.log('Created audio blob, size:', audioBlob.size);
          await saveRecording(audioBlob);
        } else {
          console.warn('No audio chunks collected');
          toast.error("Ni bilo posnetega zvoka");
        }
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error("Napaka pri snemanju");
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTimeLeft(3);
      
      // Start recording - collect data every 100ms to ensure we get chunks
      recorder.start(100);
      console.log('Recording started with timeslice 100ms');
      toast("Snemanje se je začelo...");

      // Countdown timer
      let timeLeft = 3;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setRecordingTimeLeft(timeLeft);
        console.log('Recording time left:', timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          console.log('Time elapsed, stopping recording...');
          
          if (recorder.state === 'recording') {
            recorder.stop();
            setIsRecording(false);
            toast("Snemanje končano - shranjujem...");
          } else {
            console.warn('Recorder not in recording state:', recorder.state);
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      if (error.name === 'NotAllowedError') {
        toast.error("Dostop do mikrofona ni dovoljen");
      } else if (error.name === 'NotFoundError') {
        toast.error("Mikrofon ni najden");
      } else {
        toast.error("Napaka pri dostopu do mikrofona");
      }
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