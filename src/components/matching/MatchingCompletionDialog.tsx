import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trophy, Mic, X, Star, Volume2 } from "lucide-react";
import { MatchingGameImage } from "@/data/matchingGameData";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
interface MatchingCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: MatchingGameImage[];
  onStarClaimed?: () => void;
  instructionText?: string;
  autoPlayAudio?: boolean;
}
export const MatchingCompletionDialog: React.FC<MatchingCompletionDialogProps> = ({
  isOpen,
  onClose,
  images,
  onStarClaimed,
  instructionText = "KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO.",
  autoPlayAudio = false
}) => {
  const [recordingStates, setRecordingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);
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
      setStarClaimed(false);
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

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && autoPlayAudio && images.length > 0) {
      const playAudioForImage = async () => {
        try {
          // Construct audio URL based on the word
          const word = images[0].word;
          // Use .m4a format like in regular puzzles
          const audioFilename = `${word.toLowerCase()}.m4a`;
          const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
          
          console.log('Playing audio:', audioUrl); // Debug log
          const audio = new Audio(audioUrl);
          audio.play().catch(error => {
            console.warn('Auto-play failed:', error);
            // Auto-play might be blocked by browser policy
          });
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      };
      
      // Small delay to ensure dialog is fully rendered
      setTimeout(playAudioForImage, 300);
    }
  }, [isOpen, autoPlayAudio, images]);
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
            // Auto-stop recording immediately
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            // Stop recording and update states immediately
            if (mediaRecorder && mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
            if (audioStream) {
              audioStream.getTracks().forEach(track => track.stop());
              setAudioStream(null);
            }
            // Update states immediately
            setRecordingStates(prev => ({
              ...prev,
              [imageIndex]: false
            }));
            setCompletedRecordings(prev => new Set([...prev, imageIndex]));
            setCurrentRecordingIndex(null);
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
    // Clear the current recording state and mark as completed
    if (currentRecordingIndex !== null) {
      setRecordingStates(prev => ({
        ...prev,
        [currentRecordingIndex]: false
      }));
      // Mark as completed immediately when recording stops
      setCompletedRecordings(prev => new Set([...prev, currentRecordingIndex]));
      setCurrentRecordingIndex(null);
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
      // Normalize word to remove special characters (č, š, ž, etc.)
      const normalizedWord = word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]/g, '-'); // Replace non-alphanumeric with dash
      const filename = `recording-${normalizedWord}-${timestamp}.webm`;

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
    const allCompleted = completedRecordings.size === images.length;
    if (allCompleted && !starClaimed) {
      setConfirmDialogConfig({
        title: "Zapri igro",
        description: "Če zapreš igro, ne boš prejel zvezdice. Ali si prepričan?",
        onConfirm: () => {
          setShowConfirmDialog(false);
          onClose();
        }
      });
      setShowConfirmDialog(true);
    } else if (!allCompleted) {
      setConfirmDialogConfig({
        title: "Zapri okno",
        description: "Ali ste prepričani, da se želite zapreti okno? Niste še končali vseh posnetkov.",
        onConfirm: () => {
          setShowConfirmDialog(false);
          onClose();
        }
      });
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleClaimStar = () => {
    setStarClaimed(true);
    onStarClaimed?.();
    toast({
      title: "Odlično!",
      description: "Prejel si zvezdico! ⭐"
    });
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  const handleImageClick = (imageIndex: number, word: string) => {
    // Prevent clicking if already completed or currently recording
    if (completedRecordings.has(imageIndex) || recordingStates[imageIndex]) {
      return;
    }
    startRecording(imageIndex, word);
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
    // Reset all recordings to allow re-recording
    setCompletedRecordings(new Set());
    setRecordingStates({});
    setCurrentRecordingIndex(null);
    setRecordingTimeLeft(3);
  };

  const handlePlayAudio = (image: MatchingGameImage) => {
    if (image.audio_url) {
      playAudio(image.audio_url);
    }
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dragon-green text-center">
            Odlično!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-black text-justify mx-[64px]">{instructionText}</p>
          
          {/* Display images - center single image, otherwise use grid */}
          <div className={images.length === 1 ? "flex justify-center" : "grid grid-cols-2 gap-4 mx-auto max-w-xs"}>
            {images.slice(0, 4).map((image, index) => {
            const isRecording = recordingStates[index];
            const isCompleted = completedRecordings.has(index);
            const isCurrentlyRecording = currentRecordingIndex === index;
            return <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className={`cursor-pointer transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    onClick={() => handleImageClick(index, image.word)}
                  >
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
                  </div>
                  <span className={`text-sm font-medium text-center ${isCompleted ? 'text-gray-400' : 'text-black'}`}>
                    {image.word.toUpperCase()}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio(image);
                    }}
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>;
          })}
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button onClick={handleReset} variant="outline" className="gap-2 flex-1 max-w-28">
              Ponovi
            </Button>
            
            {/* Show Claim Star button when all challenges completed */}
            {completedRecordings.size === images.length && !starClaimed && (
              <Button 
                onClick={handleClaimStar} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-32"
              >
                <Star className="w-4 h-4" />
                Vzemi zvezdico
              </Button>
            )}
            
            {/* Show Close button conditionally */}
            {(completedRecordings.size < images.length || starClaimed) && (
              <Button onClick={handleClose} className="bg-dragon-green hover:bg-dragon-green/90 gap-2 flex-1 max-w-28">
                <X className="w-4 h-4" />
                Zapri
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
      
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={confirmDialogConfig?.title || ""}
        description={confirmDialogConfig?.description || ""}
        confirmText="V redu"
        cancelText="Prekliči"
        onConfirm={() => confirmDialogConfig?.onConfirm()}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </Dialog>;
};