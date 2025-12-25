import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Volume2, Mic, X, Star } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ImageData {
  filename: string;
  word: string;
  audio?: string;
}

interface PuzzleSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  completedImage: ImageData;
  allImages?: ImageData[]; // Optional - if not provided, will use just completedImage
  onStarClaimed?: () => void;
}

export const PuzzleSuccessDialog: React.FC<PuzzleSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  completedImage,
  allImages,
  onStarClaimed
}) => {
  const [completedRecordings, setCompletedRecordings] = useState<Set<number>>(new Set());
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [displayImages, setDisplayImages] = useState<ImageData[]>([]);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const { user, selectedChild } = useAuth();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);

  // Select 4 random images including the completed one when dialog opens
  useEffect(() => {
    if (isOpen && allImages && allImages.length > 0) {
      // Always include the completed image
      const otherImages = allImages.filter(img => img.filename !== completedImage.filename);
      
      // Shuffle and take 3 random other images
      const shuffled = [...otherImages].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      // Combine with completed image and shuffle the final array
      const combined = [completedImage, ...selected].sort(() => Math.random() - 0.5);
      setDisplayImages(combined);
    } else if (isOpen && completedImage) {
      // Fallback: just show the completed image
      setDisplayImages([completedImage]);
    }
  }, [isOpen, allImages, completedImage]);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && displayImages.length > 0) {
      const normalizedWord = displayImages[0].word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const audioFilename = displayImages[0].audio || `${normalizedWord}.m4a`;
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
      playAudio(audioUrl);
    }
  }, [isOpen, displayImages, playAudio]);

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
    }
  }, [isOpen, audioStream]);

  const startRecording = async (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const localRecorder = recorder;
      const localStream = stream;
      const recordingData: Blob[] = [];
      setCurrentRecordingIndex(imageIndex);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingData.push(event.data);
        }
      };

      localRecorder.onstop = async () => {
        try {
          if (recordingData.length > 0 && user && selectedChild) {
            const audioBlob = new Blob(recordingData, { type: 'audio/webm' });
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const normalizedWord = word
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '-');
            const filename = `recording-${normalizedWord}-${timestamp}.webm`;
            const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;

            const { error } = await supabase.storage
              .from('audio-besede')
              .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });

            if (error) {
              console.error('Error saving recording:', error);
            }
          }
        } finally {
          if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
          }
        }
      };

      localRecorder.start();
      setRecordingTimeLeft(3);

      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft(prev => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            if (localRecorder.state !== 'inactive') {
              localRecorder.stop();
            }
            setCompletedRecordings(prevCompleted => new Set([...prevCompleted, imageIndex]));
            setCurrentRecordingIndex(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Napaka",
        description: "Ni mogoče dostopati do mikrofona.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
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
    setCompletedRecordings(new Set());
    setCurrentRecordingIndex(null);
    setRecordingTimeLeft(3);
    recordingDataRef.current = [];
  };

  const handleClose = () => {
    if (!starClaimed && completedRecordings.size === displayImages.length) {
      setShowConfirmDialog(true);
    } else if (completedRecordings.size < displayImages.length) {
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

  const handlePlayAudio = (image: ImageData) => {
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const audioFilename = image.audio || `${normalizedWord}.m4a`;
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const handleImageClick = (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) {
      return;
    }
    startRecording(imageIndex, word);
  };

  const allRecordingsComplete = displayImages.length > 0 && completedRecordings.size === displayImages.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4 py-4">
            <h2 className="text-2xl font-bold text-dragon-green text-center">Odlično!</h2>
            
            <p className="text-sm text-black text-center uppercase">
              KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE
            </p>
            
            {/* Display 4 images in a grid */}
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
              {displayImages.map((image, index) => {
                const isRecording = currentRecordingIndex === index;
                const isCompleted = completedRecordings.has(index);
                const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${image.filename}`;
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <div 
                      className={`cursor-pointer transition-all ${
                        isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                      onClick={() => handleImageClick(index, image.word)}
                    >
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={image.word}
                          className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 ${
                            isCompleted ? 'border-gray-400 grayscale' : 
                            isRecording ? 'border-red-500' : 'border-dragon-green'
                          }`}
                        />
                        
                        {isRecording && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                              <Mic className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                        
                        {isRecording && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                            {recordingTimeLeft}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <span className={`text-xs font-medium text-center ${
                      isCompleted ? 'text-gray-400' : 'text-black'
                    }`}>
                      {image.word.toUpperCase()}
                    </span>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(image);
                      }}
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-3">
              <Button onClick={handleReset} variant="outline" className="gap-2 flex-1 max-w-32">
                PONOVI
              </Button>
              
              {allRecordingsComplete && !starClaimed && (
                <Button 
                  onClick={handleClaimStar}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 flex-1 max-w-44"
                  disabled={starClaimed}
                >
                  <Star className="w-4 h-4" />
                  VZEMI ZVEZDICO
                </Button>
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
