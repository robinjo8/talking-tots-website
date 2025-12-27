import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trophy, Mic, X, Star, Volume2, RefreshCw } from "lucide-react";
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
  onNewGame?: () => void;
  instructionText?: string;
  autoPlayAudio?: boolean;
  isMobileLandscape?: boolean;
}
export const MatchingCompletionDialog: React.FC<MatchingCompletionDialogProps> = ({
  isOpen,
  onClose,
  images,
  onStarClaimed,
  onNewGame,
  instructionText = "KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE.",
  autoPlayAudio = false,
  isMobileLandscape = false
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

  // Auto-play audio when dialog opens (but NOT when star is claimed)
  useEffect(() => {
    if (isOpen && autoPlayAudio && images.length > 0 && !starClaimed) {
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
  }, [isOpen, autoPlayAudio, images, starClaimed]);
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
      
      // CRITICAL: Capture BOTH recorder and stream in local scope for callbacks
      const localRecorder = recorder;
      const localStream = stream;
      
      // Use separate data array for this specific recording
      const recordingData: Blob[] = [];
      setCurrentRecordingIndex(imageIndex);
      
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          console.log('[DATA] Recording data available for index:', imageIndex, 'size:', event.data.size, 'bytes');
          recordingData.push(event.data);
        }
      };
      
      localRecorder.onstop = async () => {
        console.log('[ONSTOP] Recording stopped for index:', imageIndex, 'word:', word);
        console.log('[ONSTOP] Data chunks:', recordingData.length);
        
        try {
          // Save recording after MediaRecorder has stopped
          if (recordingData.length > 0) {
            // Create blob from local recordingData
            const audioBlob = new Blob(recordingData, { type: 'audio/webm' });
            console.log('[ONSTOP] Created audio blob, size:', audioBlob.size, 'bytes');
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const normalizedWord = word
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '-');
            const filename = `recording-${normalizedWord}-${timestamp}.webm`;
            const userSpecificPath = `recordings/${user!.email}/child-${selectedChild!.id}/${filename}`;
            
            console.log('[ONSTOP] Uploading to path:', userSpecificPath);
            
            const { error } = await supabase.storage
              .from('audio-besede')
              .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });
            
            if (error) {
              console.error('[ONSTOP] Supabase storage error:', error);
              toast({
                title: "Napaka",
                description: `Snemanje ni bilo shranjeno: ${error.message}`,
                variant: "destructive"
              });
            } else {
              console.log('[ONSTOP] Recording saved successfully to:', userSpecificPath);
              // Recording saved - no toast notification per user request
            }
          } else {
            console.error('[ONSTOP] No recording data available');
            toast({
              title: "Napaka",
              description: "Ni podatkov za shranjevanje. Poskusite ponovno.",
              variant: "destructive"
            });
            setCurrentRecordingIndex(null);
          }
        } finally {
          console.log('[ONSTOP] Finally block for index:', imageIndex);
          // Ustavi LOCAL stream šele KO je shranjeno!
          if (localStream) {
            console.log('[ONSTOP] Stopping localStream tracks:', localStream.getTracks().length);
            localStream.getTracks().forEach(track => track.stop());
          }
          
          // Remove from pending saves (always execute, even if error occurred)
          pendingSavesRef.current.delete(imageIndex);
          setIsSavingRecording(pendingSavesRef.current.size > 0);
          console.log('[ONSTOP] Pending saves remaining:', pendingSavesRef.current.size);
        }
      };

      // Start recording
      console.log('[START] Starting recorder for index:', imageIndex, 'word:', word);
      localRecorder.start();
      console.log('[START] Recorder state after start:', localRecorder.state);
      setRecordingTimeLeft(3);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            console.log('[COUNTDOWN] Time up for index:', imageIndex);
            // Auto-stop recording
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            // Track this save operation BEFORE stopping recorder
            pendingSavesRef.current.add(imageIndex);
            setIsSavingRecording(true);
            console.log('[COUNTDOWN] Calling stop on localRecorder for index:', imageIndex);
            console.log('[COUNTDOWN] LocalRecorder state:', localRecorder.state);
            
            // Stop the LOCAL recorder, not the global state
            if (localRecorder.state !== 'inactive') {
              localRecorder.stop();
              console.log('[COUNTDOWN] LocalRecorder.stop() called');
            } else {
              console.error('[COUNTDOWN] LocalRecorder already inactive!');
            }
            
            // Mark as completed immediately for UI feedback
            setCompletedRecordings(prevCompleted => new Set([...prevCompleted, imageIndex]));
            setCurrentRecordingIndex(null);
            console.log('[COUNTDOWN] Completed for index:', imageIndex);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Recording started - no toast notification per user request
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
    console.log('[STOP] stopRecording called, currentIndex:', currentRecordingIndex);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (mediaRecorder) {
      console.log('[STOP] MediaRecorder state:', mediaRecorder.state);
      if (mediaRecorder.state !== 'inactive') {
        console.log('[STOP] Calling mediaRecorder.stop()');
        mediaRecorder.stop();
      } else {
        console.error('[STOP] MediaRecorder already inactive!');
      }
    } else {
      console.error('[STOP] No mediaRecorder available!');
    }
    
    // Don't stop audioStream here - it will be stopped in recorder.onstop after saving
    // Don't set currentRecordingIndex to null here - it will be set in saveRecording
  };
  // This function is no longer needed - saving is done directly in recorder.onstop
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
    // Don't auto-close if onNewGame is provided - let user choose Nova igra or close
    if (!onNewGame) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
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
      <DialogContent className={isMobileLandscape 
        ? "w-[60vw] h-screen max-h-screen rounded-none flex flex-col justify-between py-4" 
        : "sm:max-w-lg"
      }>
        <DialogHeader className={isMobileLandscape ? "pb-0 flex-shrink-0" : ""}>
          <DialogTitle className={`font-bold text-dragon-green text-center ${isMobileLandscape ? "text-xl" : "text-lg md:text-2xl"}`}>
            Odlično!
          </DialogTitle>
        </DialogHeader>
        <div className={isMobileLandscape 
          ? "flex-1 flex flex-col justify-center items-center space-y-3 py-2" 
          : "space-y-2 md:space-y-6 py-2 md:py-4"
        }>
          <p className={`text-black text-center uppercase ${isMobileLandscape ? "text-sm" : "text-xs md:text-sm"}`}>{instructionText}</p>
          
          {/* Display images - centered grid based on count */}
          <div className={images.length === 1 
            ? "flex justify-center" 
            : `flex justify-center flex-wrap gap-2 md:gap-4`
          }>
            {images.map((image, index) => {
            const isRecording = currentRecordingIndex === index;
            const isCompleted = completedRecordings.has(index);
            // For 5 images, use smaller sizes to fit
            const isFiveImages = images.length === 5;
            return <div key={index} className={`flex flex-col items-center ${isMobileLandscape ? "space-y-1" : "space-y-1 md:space-y-2"}`}>
                  <div 
                    className={`cursor-pointer transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    onClick={() => handleImageClick(index, image.word)}
                  >
                    <div className="relative">
                      <img src={image.url} alt={image.word} className={`object-cover rounded-xl border-2 ${isMobileLandscape 
                        ? isFiveImages ? "w-14 h-14" : "w-16 h-16" 
                        : isFiveImages ? "w-12 h-12 md:w-16 md:h-16" : "w-14 h-14 md:w-20 md:h-20"
                      } ${isCompleted ? 'border-gray-400 grayscale' : isRecording ? 'border-red-500' : 'border-dragon-green'}`} />
                      {isRecording && <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                            <Mic className="w-3 h-3 md:w-4 md:h-4" />
                          </div>
                        </div>}
                      {isRecording && <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                          {recordingTimeLeft}
                        </div>}
                    </div>
                  </div>
                  <span className={`font-medium text-center ${isMobileLandscape 
                    ? isFiveImages ? "text-[10px]" : "text-xs" 
                    : isFiveImages ? "text-[10px] md:text-xs" : "text-xs md:text-sm"
                  } ${isCompleted ? 'text-gray-400' : 'text-black'}`}>
                    {image.word.toUpperCase()}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio(image);
                    }}
                    size="icon"
                    className={`bg-green-500 hover:bg-green-600 text-white ${isMobileLandscape 
                      ? isFiveImages ? "h-8 w-8" : "h-10 w-10" 
                      : isFiveImages ? "h-7 w-7 md:h-10 md:w-10" : "h-8 w-8 md:h-12 md:h-12"
                    }`}
                  >
                    <Volume2 className={isMobileLandscape 
                      ? isFiveImages ? "w-4 h-4" : "w-5 h-5" 
                      : isFiveImages ? "w-3 h-3 md:w-5 md:h-5" : "w-4 h-4 md:w-6 md:h-6"
                    } />
                  </Button>
                </div>;
          })}
          </div>
        </div>

        {/* Action buttons - always visible at bottom */}
        <div className={`flex justify-center gap-3 flex-shrink-0 ${isMobileLandscape ? "pb-2" : ""}`}>
          <Button onClick={handleReset} variant="outline" className={`gap-2 flex-1 max-w-32 ${isMobileLandscape ? "h-10" : ""}`}>
            Ponovi
          </Button>
          
          {completedRecordings.size === images.length && !starClaimed ? (
            <Button 
              onClick={handleClaimStar} 
              className={`bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-36 ${isMobileLandscape ? "h-10" : ""}`}
              disabled={isSavingRecording}
            >
              <Star className="w-4 h-4" />
              {isSavingRecording ? 'Shranjujem...' : 'Vzemi zvezdico'}
            </Button>
          ) : starClaimed && onNewGame ? (
            <Button 
              onClick={() => {
                onClose();
                onNewGame();
              }} 
              className={`bg-blue-500 hover:bg-blue-600 text-white gap-2 flex-1 max-w-36 ${isMobileLandscape ? "h-10" : ""}`}
            >
              <RefreshCw className="w-4 h-4" />
              Nova igra
            </Button>
          ) : (
            <Button onClick={handleClose} className={`bg-dragon-green hover:bg-dragon-green/90 gap-2 flex-1 max-w-32 ${isMobileLandscape ? "h-10" : ""}`}>
              <X className="w-4 h-4" />
              Zapri
            </Button>
          )}
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