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
  instructionText = "KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE.",
  autoPlayAudio = false
}) => {
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSavingRecording, setIsSavingRecording] = useState(false);
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
  const pendingSavesRef = useRef<Set<number>>(new Set());

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
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
      pendingSavesRef.current.clear();
    }
  }, [isOpen, audioStream]);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && autoPlayAudio && images.length > 0) {
      const playAudioForImage = async () => {
        try {
          // Construct audio URL based on the word
          const word = images[0].word;
          // Normalize word to remove diacritics (č, š, ž, etc.)
          const normalizedWord = word
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
          // Use .m4a format like in regular puzzles
          const audioFilename = `${normalizedWord}.m4a`;
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
          console.log('Recording data available:', event.data.size, 'bytes');
          recordingDataRef.current.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        console.log('Recording stopped, data chunks:', recordingDataRef.current.length);
        // Track this save operation
        pendingSavesRef.current.add(imageIndex);
        setIsSavingRecording(true);
        
        // Save recording after MediaRecorder has stopped
        if (recordingDataRef.current.length > 0) {
          await saveRecording(word, imageIndex);
        } else {
          console.error('No recording data available in onstop');
          toast({
            title: "Napaka",
            description: "Ni podatkov za shranjevanje. Poskusite ponovno.",
            variant: "destructive"
          });
          setCurrentRecordingIndex(null);
        }
        
        // Remove from pending saves
        pendingSavesRef.current.delete(imageIndex);
        setIsSavingRecording(pendingSavesRef.current.size > 0);
      };

      // Start recording
      recorder.start();
      setRecordingTimeLeft(3);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-stop recording
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            stopRecording();
            // Mark as completed immediately for UI feedback
            setCompletedRecordings(prevCompleted => new Set([...prevCompleted, imageIndex]));
            setCurrentRecordingIndex(null);
            // Note: saveRecording() is still called from onstop event but won't change state
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

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    // Don't set currentRecordingIndex to null here - it will be set in saveRecording
  };
  const saveRecording = async (word: string, imageIndex: number) => {
    console.log('saveRecording called with word:', word, 'imageIndex:', imageIndex);
    console.log('recordingDataRef.current.length:', recordingDataRef.current.length);
    
    if (recordingDataRef.current.length === 0) {
      console.error('No recording data to save');
      toast({
        title: "Napaka",
        description: "Ni podatkov za shranjevanje. Poskusite ponovno.",
        variant: "destructive"
      });
      setCurrentRecordingIndex(null);
      return;
    }

    // Check if user is authenticated and child is selected
    if (!user || !selectedChild) {
      console.error('User not authenticated or no child selected', { user: !!user, selectedChild: !!selectedChild });
      toast({
        title: "Napaka",
        description: "Prijavite se za shranjevanje posnetka.",
        variant: "destructive"
      });
      setCurrentRecordingIndex(null);
      return;
    }

    console.log('Attempting to save recording...', { user: user.email, child: selectedChild.id });
    try {
      const audioBlob = new Blob(recordingDataRef.current, {
        type: 'audio/webm'
      });
      console.log('Created audio blob, size:', audioBlob.size, 'bytes');
      
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
      console.log('Uploading to path:', userSpecificPath);
      
      const {
        error
      } = await supabase.storage.from('audio-besede').upload(userSpecificPath, audioBlob, {
        contentType: 'audio/webm'
      });
      
      if (error) {
        console.error('Supabase storage error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast({
          title: "Napaka",
          description: `Snemanje ni bilo shranjeno: ${error.message}`,
          variant: "destructive"
        });
        // Don't change state here - already updated in countdown
      } else {
        console.log('Recording saved successfully to:', userSpecificPath);
        toast({
          title: "Odlično!",
          description: "Tvoja izgovorjava je bila shranjena."
        });
        // Don't change state here - already updated in countdown
      }
    } catch (error) {
      console.error('Error in saveRecording:', error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake pri shranjevanju.",
        variant: "destructive"
      });
      // Don't change state here - already updated in countdown
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

  const handleClaimStar = async () => {
    // Wait for any ongoing save operation to complete
    if (pendingSavesRef.current.size > 0) {
      toast({
        title: "Počakaj",
        description: "Shranjujem posnetke..."
      });
      
      // Wait for all saves to complete
      const checkInterval = setInterval(() => {
        if (pendingSavesRef.current.size === 0) {
          clearInterval(checkInterval);
          proceedWithStarClaim();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (pendingSavesRef.current.size > 0) {
          console.error('Timeout waiting for saves to complete');
          proceedWithStarClaim();
        }
      }, 10000);
      
      return;
    }
    
    proceedWithStarClaim();
  };

  const proceedWithStarClaim = () => {
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
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) {
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
          <p className="text-sm text-black text-center">{instructionText}</p>
          
          {/* Display images - center single image, otherwise use grid */}
          <div className={images.length === 1 ? "flex justify-center" : "grid grid-cols-2 gap-4 mx-auto max-w-xs"}>
            {images.slice(0, 4).map((image, index) => {
            const isRecording = currentRecordingIndex === index;
            const isCompleted = completedRecordings.has(index);
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
                      {isRecording && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
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
                disabled={isSavingRecording}
              >
                <Star className="w-4 h-4" />
                {isSavingRecording ? 'Shranjujem...' : 'Vzemi zvezdico'}
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