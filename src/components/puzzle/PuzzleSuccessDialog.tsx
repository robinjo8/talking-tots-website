import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Volume2, Mic, X, Star } from 'lucide-react';
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
  onStarClaimed?: () => void;
}

export const PuzzleSuccessDialog: React.FC<PuzzleSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage,
  onStarClaimed
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
        // Recording data will be handled by countdown completion
      };

      // Start recording
      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-stop recording and set hasRecorded
            stopRecording();
            setHasRecorded(true);
            saveRecording();
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
    if (!starClaimed) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onOpenChange(false);
  };

  const handleClaimStar = () => {
    setStarClaimed(true);
    onStarClaimed?.();
    toast({
      title: "Odlično!",
      description: "Prejel si zvezdico! ⭐"
    });
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
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
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold text-dragon-green text-center">Odlično!</h2>
          
          <p className="text-sm text-black text-center">
            KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
          </p>
          
          <div className="flex justify-center">
            <div 
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                hasRecorded ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handleImageClick}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={completedImage.word}
                  className={`w-32 h-32 object-cover rounded-lg border-2 ${
                    hasRecorded ? 'border-gray-400' : 
                    isRecording ? 'border-red-500' : 'border-dragon-green'
                  }`}
                />
                
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                    <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {recordingTimeLeft}
                  </div>
                )}
              </div>
              
              <span className={`text-lg font-medium text-center ${
                hasRecorded ? 'text-gray-400' : 'text-black'
              }`}>
                {completedImage.word.toUpperCase()}
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

          <div className="flex justify-center gap-3">
            {hasRecorded && (
              <>
                <Button onClick={handleReset} variant="outline" className="gap-2 flex-1 max-w-32">
                  PONOVI
                </Button>
                <Button 
                  onClick={handleClaimStar}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-44"
                  disabled={starClaimed}
                >
                  <Star className="w-4 h-4" />
                  VZEMI ZVEZDICO
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    <ConfirmDialog
      open={showConfirmDialog}
      onOpenChange={setShowConfirmDialog}
      title="Zapri igro"
      description="Če zapreš igro, ne boš prejel zvezdice. Ali si prepričan?"
      confirmText="V redu"
      cancelText="Prekliči"
      onConfirm={handleConfirmClose}
      onCancel={() => setShowConfirmDialog(false)}
    />
  </>
  );
};