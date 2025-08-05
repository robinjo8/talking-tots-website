import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Mic, X } from "lucide-react";
import { MatchingGameImage } from "@/data/matchingGameData";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
interface MatchingCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: MatchingGameImage[];
}
export const MatchingCompletionDialog: React.FC<MatchingCompletionDialogProps> = ({
  isOpen,
  onClose,
  images
}) => {
  const [recordingStates, setRecordingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const {
    playAudio
  } = useAudioPlayback();
  const {
    toast
  } = useToast();
  const {
    user,
    selectedChild
  } = useAuth();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      setRecordingStates({});
      setCompletedRecordings(new Set());
      setRecordingTimeLeft(3);
      setCurrentRecordingIndex(null);
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
  const startRecording = async (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex)) return;
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      setAudioStream(stream);

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recordingDataRef.current = [];
      setCurrentRecordingIndex(imageIndex);
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordingDataRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        saveRecording(word, imageIndex);
      };

      // Start recording
      recorder.start();
      setRecordingStates(prev => ({
        ...prev,
        [imageIndex]: true
      }));
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
    // Only clear the current recording state, not all recording states
    if (currentRecordingIndex !== null) {
      setRecordingStates(prev => ({
        ...prev,
        [currentRecordingIndex]: false
      }));
    }
    setRecordingTimeLeft(3);
  };
  const saveRecording = async (word: string, imageIndex: number) => {
    if (recordingDataRef.current.length === 0) {
      console.log('No recording data to save');
      // Still mark as completed even if no data
      setCompletedRecordings(prev => new Set([...prev, imageIndex]));
      setCurrentRecordingIndex(null);
      return;
    }

    // Check if user is authenticated and child is selected
    if (!user || !selectedChild) {
      console.error('User not authenticated or no child selected');
      toast({
        title: "Napaka",
        description: "Prijavite se za shranjevanje posnetka.",
        variant: "destructive"
      });
      // Still mark as completed even if auth fails
      setCompletedRecordings(prev => new Set([...prev, imageIndex]));
      setCurrentRecordingIndex(null);
      return;
    }

    // Mark as completed first to prevent multiple clicks
    setCompletedRecordings(prev => new Set([...prev, imageIndex]));
    setCurrentRecordingIndex(null);

    try {
      const audioBlob = new Blob(recordingDataRef.current, {
        type: 'audio/webm'
      });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `recording-${word.toLowerCase()}-${timestamp}.webm`;

      // Create user-specific path: recordings/{user-email}/child-{child-id}/
      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;
      const {
        error
      } = await supabase.storage.from('audio-besede').upload(userSpecificPath, audioBlob, {
        contentType: 'audio/webm'
      });
      if (error) {
        console.error('Error saving recording:', error);
        toast({
          title: "Napaka",
          description: "Snemanje ni bilo shranjeno.",
          variant: "destructive"
        });
      } else {
        console.log('Recording saved successfully to:', userSpecificPath);
        toast({
          title: "Odlično!",
          description: "Tvoja izgovorjava je bila shranjena."
        });
      }
    } catch (error) {
      console.error('Error in saveRecording:', error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake pri shranjevanju.",
        variant: "destructive"
      });
    }
    recordingDataRef.current = [];
  };
  const handleClose = () => {
    const allCompleted = completedRecordings.size === 4;
    if (!allCompleted) {
      if (window.confirm("Ali ste prepričani, da se želite zapreti okno? Niste še končali vseh posnetkov.")) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  const handleImageClick = (imageIndex: number, word: string) => {
    // Prevent clicking if already completed or currently recording
    if (completedRecordings.has(imageIndex) || recordingStates[imageIndex]) {
      return;
    }
    startRecording(imageIndex, word);
  };

  const handleReset = () => {
    // Reset all recordings to allow re-recording
    setCompletedRecordings(new Set());
    setRecordingStates({});
    setCurrentRecordingIndex(null);
    setRecordingTimeLeft(3);
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dragon-green text-center">
            Bravo!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-sm text-black">
            Klikni na spodnje sličice in ponovi besede
          </p>
          
          {/* Display images in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 mx-auto max-w-xs">
            {images.slice(0, 4).map((image, index) => {
            const isRecording = recordingStates[index];
            const isCompleted = completedRecordings.has(index);
            const isCurrentlyRecording = currentRecordingIndex === index;
            return <div key={index} className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`} onClick={() => handleImageClick(index, image.word)}>
                  <div className="relative">
                    <img src={image.url} alt={image.word} className={`w-20 h-20 object-cover rounded-lg border-2 ${isCompleted ? 'border-gray-400 grayscale' : isRecording ? 'border-red-500' : 'border-dragon-green'}`} />
                    {isRecording && <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                        <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                      </div>}
                    {isCurrentlyRecording && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {recordingTimeLeft}
                      </div>}
                  </div>
                  <span className={`text-sm font-medium text-center ${isCompleted ? 'text-gray-400' : 'text-black'}`}>
                    {image.word.toUpperCase()}
                  </span>
                </div>;
          })}
          </div>

          {/* Reset button */}
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              Ponovi
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleClose} className="bg-dragon-green hover:bg-dragon-green/90 gap-2">
            <X className="w-4 h-4" />
            Zapri
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};