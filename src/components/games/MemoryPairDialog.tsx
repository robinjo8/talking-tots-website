import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Star } from "lucide-react";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
      const filename = `memory-${word.toLowerCase()}-${timestamp}.webm`;

      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;
      const { error } = await supabase.storage
        .from('audio-besede')
        .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });

      if (error) {
        console.error('Error saving recording:', error);
      } else {
        console.log('Recording saved successfully to:', userSpecificPath);
      }
    } catch (error) {
      console.error('Error in saveRecording:', error);
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

  const handleClose = () => {
    // Un-match the pair when dialog is closed without recording
    onUnmatch();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dragon-green text-center">
            Par {pairNumber} od {totalPairs}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-black text-center">
            KLIKNI NA SLIČICO IN PONOVI BESEDO. IMAŠ 3 SEKUNDE ČASA.
          </p>
          
          <div className="flex justify-center">
            <div 
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                hasRecorded ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={handleImageClick}
            >
              <div className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={word || "Spominska kartica"}
                    className={`w-32 h-32 object-cover rounded-lg border-2 ${
                      hasRecorded ? 'border-gray-400' : 
                      isRecording ? 'border-red-500' : 'border-dragon-green'
                    }`}
                  />
                )}
                
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
              
              {word && (
                <span className={`text-lg font-medium text-center ${
                  hasRecorded ? 'text-gray-400' : 'text-black'
                }`}>
                  {word.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {hasRecorded && (
              <Button 
                onClick={handleContinue}
                className={`gap-2 ${
                  isLastPair 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-dragon-green hover:bg-dragon-green/90 text-white'
                }`}
              >
                {isLastPair ? (
                  <>
                    <Star className="w-4 h-4" />
                    Vzemi zvezdico
                  </>
                ) : (
                  'Nadaljuj'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};