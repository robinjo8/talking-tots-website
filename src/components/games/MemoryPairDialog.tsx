import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Star, Volume2 } from "lucide-react";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface MemoryPairDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onUnmatch: () => void;
  pairNumber: number;
  totalPairs: number;
  imageUrl: string | null;
  word: string | null;
  audioUrl: string | null;
}

export const MemoryPairDialog: React.FC<MemoryPairDialogProps> = ({
  isOpen,
  onClose,
  onContinue,
  onUnmatch,
  pairNumber,
  totalPairs,
  imageUrl,
  word,
  audioUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const { user, selectedChild } = useAuth();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);

  const isLastPair = pairNumber === totalPairs;

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
    if (hasRecorded || isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recordingDataRef.current = [];

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordingDataRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        saveRecording();
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);

      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
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
            setHasRecorded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Snemanje se je začelo",
        description: "Povej besedo glasno in razločno!"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Napaka",
        description: "Ni mogoče dostopati do mikrofona.",
        variant: "destructive"
      });
    }
  };

  const saveRecording = async () => {
    if (recordingDataRef.current.length === 0 || !word) {
      console.log('No recording data to save');
      return;
    }

    if (!user || !selectedChild) {
      console.error('User not authenticated or no child selected');
      return;
    }

    try {
      const audioBlob = new Blob(recordingDataRef.current, { type: 'audio/webm' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // Normalize word to remove special characters (č, š, ž, etc.)
      const normalizedWord = word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]/g, '-'); // Replace non-alphanumeric with dash
      const filename = `memory-${normalizedWord}-${timestamp}.webm`;

      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;
      const { error } = await supabase.storage
        .from('audio-besede')
        .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });

      if (error) {
        console.error('Error saving recording:', error);
        toast({
          title: "Napaka",
          description: "Snemanje ni bilo shranjeno. Poskusi znova.",
          variant: "destructive"
        });
      } else {
        console.log('Recording saved successfully to:', userSpecificPath);
        toast({
          title: "Odlično!",
          description: "Tvoja izgovorjava je bila shranjena.",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Error in saveRecording:', error);
      toast({
        title: "Napaka",
        description: "Snemanje ni bilo shranjeno. Poskusi znova.",
        variant: "destructive"
      });
    }
    
    recordingDataRef.current = [];
  };

  const handleImageClick = () => {
    if (!hasRecorded && !isRecording) {
      startRecording();
    }
  };

  const handleContinue = () => {
    if (isLastPair) {
      // This is the last pair, award star
      toast({
        title: "Odlično!",
        description: "Prejel si zvezdico! ⭐"
      });
    }
    onContinue();
  };

  const handleReset = () => {
    // Clear any running countdown timer
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    // Stop any ongoing recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    // Reset recording state to allow re-recording
    setHasRecorded(false);
    setIsRecording(false);
    setRecordingTimeLeft(3);
    recordingDataRef.current = [];
  };

  const handleCloseAttempt = () => {
    // Show confirmation dialog before closing
    setShowCloseConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowCloseConfirmation(false);
    // Un-match the pair when dialog is closed without continuing
    onUnmatch();
    onClose();
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] sm:max-w-lg overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-1 sm:pb-2">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-dragon-green text-center">
            Par {pairNumber} od {totalPairs}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 sm:space-y-6 py-1 sm:py-4">
          <p className="text-xs sm:text-sm text-black text-center">
            KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
          </p>
          
          <div className="flex justify-center">
            <div 
              className={`flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-all ${
                hasRecorded ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handleImageClick}
            >
              <div className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={word || "Spominska kartica"}
                    className={`w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg border-2 ${
                      hasRecorded ? 'border-gray-400' : 
                      isRecording ? 'border-red-500' : 'border-dragon-green'
                    }`}
                  />
                )}
                
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold">
                    {recordingTimeLeft}
                  </div>
                )}
              </div>
              
              {word && (
                <span className={`text-base sm:text-lg font-medium text-center ${
                  hasRecorded ? 'text-gray-400' : 'text-black'
                }`}>
                  {word.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Audio playback button */}
          <div className="flex justify-center">
            <Button
              onClick={() => audioUrl && playAudio(audioUrl)}
              disabled={!audioUrl}
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 sm:h-12 sm:w-12"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3">
            {hasRecorded && (
              <>
                <Button onClick={handleReset} variant="outline" className="gap-1 sm:gap-2 flex-1 max-w-24 sm:max-w-28 text-sm sm:text-base h-9 sm:h-10">
                  Ponovi
                </Button>
                <Button 
                  onClick={handleContinue}
                  className={`gap-1 sm:gap-2 flex-1 text-sm sm:text-base h-9 sm:h-10 ${
                    isLastPair 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white max-w-28 sm:max-w-32' 
                      : 'bg-dragon-green hover:bg-dragon-green/90 text-white max-w-24 sm:max-w-28'
                  }`}
                >
                  {isLastPair ? (
                    <>
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      Vzemi zvezdico
                    </>
                  ) : (
                    'Nadaljuj'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      open={showCloseConfirmation}
      onOpenChange={setShowCloseConfirmation}
      title="Zapuščaš igro"
      description="Ali res želiš zapreti okno? Tvoj posnetek ne bo shranjen."
      confirmText="Zapri"
      cancelText="Nadaljuj z igro"
      confirmVariant="destructive"
      onConfirm={handleConfirmClose}
      onCancel={handleCancelClose}
    />
    </>
  );
};