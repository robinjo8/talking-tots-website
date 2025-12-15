import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, Star } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressCircles } from './ProgressCircles';

interface WheelSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: {
    filename: string;
    word: string;
    audio?: string;
  };
  pronunciationCount: number; // 0, 1, 2, or 3
  onRecordComplete: () => void; // Called when user records successfully
  onStarClaimed: () => void;
}

export const WheelSuccessDialog: React.FC<WheelSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage,
  pronunciationCount,
  onRecordComplete,
  onStarClaimed
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [starClaimed, setStarClaimed] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [justRecorded, setJustRecorded] = useState(false);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const { user, selectedChild } = useAuth();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);

  const canClaimStar = pronunciationCount >= 3;

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && completedImage) {
      const normalizedWord = completedImage.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
      playAudio(audioUrl);
      setJustRecorded(false);
      setStarClaimed(false);
    }
  }, [isOpen, completedImage, playAudio]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setRecordingTimeLeft(3);
      setJustRecorded(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
      mediaRecorderRef.current = null;
      recordingDataRef.current = [];
    }
  }, [isOpen, audioStream]);

  const startRecording = async () => {
    if (justRecorded) return; // Prevent multiple recordings in same session
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordingDataRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingDataRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Only save recording here - UI state updates happen in stopRecording
        if (recordingDataRef.current.length > 0) {
          await saveRecording();
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);

      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
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

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }

    setIsRecording(false);
    setRecordingTimeLeft(3);
    
    // Immediately update UI state - don't wait for async onstop callback
    setJustRecorded(true);
    onRecordComplete();
  };

  const saveRecording = async () => {
    if (recordingDataRef.current.length === 0) return;

    if (!user || !selectedChild) {
      console.error('User not authenticated or no child selected');
      return;
    }

    try {
      const audioBlob = new Blob(recordingDataRef.current, { type: 'audio/webm' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const normalizedWord = completedImage.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-');
      const filename = `recording-${normalizedWord}-${timestamp}.webm`;
      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;

      await supabase.storage
        .from('audio-besede')
        .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });

      toast({
        title: "Odlično!",
        description: "Tvoja izgovorjava je bila shranjena.",
      });
    } catch (error) {
      console.error('Error in saveRecording:', error);
    }

    recordingDataRef.current = [];
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleClaimStar = () => {
    setStarClaimed(true);
    onStarClaimed();
    toast({
      title: "Čestitke! 🎉",
      description: "Osvojil si to besedo in prejel zvezdico! ⭐"
    });
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  };

  const handlePlayAudio = () => {
    const normalizedWord = completedImage.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const audioFilename = completedImage.audio || `${normalizedWord}.m4a`;
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const handleImageClick = () => {
    if (!isRecording && !justRecorded) {
      startRecording();
    }
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${completedImage.filename}`;

  // Display count includes the just-recorded one if applicable
  const displayCount = justRecorded ? Math.min(pronunciationCount + 1, 3) : pronunciationCount;
  const showClaimButton = displayCount >= 3;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4 py-4">
            <h2 className="text-2xl font-bold text-dragon-green text-center">
              {showClaimButton ? '🎉 Čestitke! 🎉' : 'Odlično!'}
            </h2>
            
            {!showClaimButton && (
              <p className="text-sm text-black text-center">
                KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
              </p>
            )}
            
            <div className="flex justify-center">
              <div 
                className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                  (justRecorded || showClaimButton)
                    ? 'opacity-70 cursor-not-allowed grayscale'
                    : 'hover:scale-105'
                }`}
                onClick={handleImageClick}
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={completedImage.word}
                    className={`w-32 h-32 object-cover rounded-lg border-2 ${
                      showClaimButton ? 'border-yellow-400' :
                      justRecorded ? 'border-gray-400' : 
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
                
                <span className="text-lg font-medium text-center text-black">
                  {completedImage.word.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress circles and count */}
            <div className="flex flex-col items-center space-y-2">
              <ProgressCircles count={displayCount} size="lg" animate={justRecorded} />
              <span className="text-sm text-muted-foreground">
                Izgovoril si {displayCount}/3 krat
                {!showClaimButton && ` (še ${3 - displayCount}x za zvezdico)`}
              </span>
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

            {/* Action buttons */}
            <div className="flex justify-center gap-3">
              {showClaimButton ? (
                <Button 
                  onClick={handleClaimStar}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8"
                  disabled={starClaimed}
                >
                  <Star className="w-5 h-5" />
                  VZEMI ZVEZDICO
                </Button>
              ) : justRecorded ? (
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="bg-dragon-green hover:bg-dragon-green/90 text-white"
                >
                  NADALJUJ
                </Button>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
