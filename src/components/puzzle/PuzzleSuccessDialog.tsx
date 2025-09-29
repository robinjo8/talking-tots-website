import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, X } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PuzzleSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: {
    filename: string;
    word: string;
  };
}

export const PuzzleSuccessDialog: React.FC<PuzzleSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const { user, selectedChild } = useAuth();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && completedImage.word) {
      const wordLower = completedImage.word.toLowerCase();
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${wordLower}.m4a`;
      playAudio(audioUrl);
    }
  }, [isOpen, completedImage.word, playAudio]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setHasRecorded(false);
      setRecordingTimeLeft(3);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
      setMediaRecorder(null);
      recordingDataRef.current = [];
    }
  }, [isOpen, audioStream]);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recordingDataRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingDataRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        setHasRecorded(true);
        saveRecording();
      };

      // Start recording
      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-stop recording
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Snemanje se je začelo",
        description: "Povej besedo glasno in razločno!",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Napaka",
        description: "Ni mogoče dostopati do mikrofona.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }

    setIsRecording(false);
    setRecordingTimeLeft(3);
  };

  const saveRecording = async () => {
    if (recordingDataRef.current.length === 0) {
      console.log('No recording data to save');
      return;
    }

    // Check if user is authenticated and child is selected
    if (!user || !selectedChild) {
      console.error('User not authenticated or no child selected');
      toast({
        title: "Napaka",
        description: "Prijavite se za shranjevanje posnetka.",
        variant: "destructive",
      });
      return;
    }

    try {
      const audioBlob = new Blob(recordingDataRef.current, { type: 'audio/webm' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `recording-${completedImage.word.toLowerCase()}-${timestamp}.webm`;
      
      // Create user-specific path: recordings/{user-email}/child-{child-id}/
      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;

      const { error } = await supabase.storage
        .from('zvocni-posnetki')
        .upload(userSpecificPath, audioBlob, {
          contentType: 'audio/webm'
        });

      if (error) {
        console.error('Error saving recording:', error);
        toast({
          title: "Napaka",
          description: "Snemanje ni bilo shranjeno.",
          variant: "destructive",
        });
      } else {
        console.log('Recording saved successfully to:', userSpecificPath);
        toast({
          title: "Odlično!",
          description: "Tvoja izgovorjava je bila shranjena.",
        });
      }
    } catch (error) {
      console.error('Error in saveRecording:', error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake pri shranjevanju.",
        variant: "destructive",
      });
    }

    recordingDataRef.current = [];
  };

  const handleReset = () => {
    setHasRecorded(false);
    setIsRecording(false);
    setRecordingTimeLeft(3);
    recordingDataRef.current = [];
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handlePlayAudio = () => {
    const wordLower = completedImage.word.toLowerCase();
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${wordLower}.m4a`;
    playAudio(audioUrl);
  };

  const handleImageClick = () => {
    if (!isRecording) {
      startRecording();
    }
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${completedImage.filename}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-dragon-green">Odlično!</h2>
          
          {/* Instruction Text */}
          <p className="text-sm text-black text-center">
            KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
          </p>
          
          {/* Image */}
          <div className="relative">
            <img 
              src={imageUrl}
              alt={completedImage.word}
              className={`w-48 h-48 object-contain mx-auto border-2 border-dragon-green rounded-lg cursor-pointer transition-all ${
                isRecording || hasRecorded ? 'opacity-50 grayscale' : 'hover:opacity-80'
              }`}
              onClick={handleImageClick}
            />
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Snemanje... {recordingTimeLeft}s
                </div>
              </div>
            )}
          </div>
          
          {/* Word */}
          <div className="text-3xl font-bold text-gray-800">
            {completedImage.word}
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Play Audio Button */}
            <Button
              onClick={handlePlayAudio}
              size="lg"
              variant="outline"
              className="gap-2 w-full"
            >
              <Volume2 className="w-5 h-5" />
              PREDVAJAJ
            </Button>
            
            {/* Recording Action Buttons */}
            {hasRecorded && (
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="gap-2 flex-1"
                >
                  PONOVI
                </Button>
                <Button
                  onClick={handleClose}
                  size="lg"
                  className="gap-2 flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  SHRANI
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};