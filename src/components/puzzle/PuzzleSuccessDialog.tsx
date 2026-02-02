import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Volume2, Mic } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

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
  const [showBravoDialog, setShowBravoDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [displayImages, setDisplayImages] = useState<ImageData[]>([]);
  const { playAudio } = useAudioPlayback();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const imagesInitializedRef = useRef(false);
  const hasAutoTransitionedRef = useRef(false);

  // Auto-transition to BRAVO dialog when all recordings complete
  useEffect(() => {
    if (displayImages.length > 0 && completedRecordings.size === displayImages.length && !hasAutoTransitionedRef.current) {
      hasAutoTransitionedRef.current = true;
      // Small delay for smooth transition
      setTimeout(() => {
        setShowBravoDialog(true);
        // NOTE: onStarClaimed is called when user clicks "VZEMI ZVEZDICO" button, not here
      }, 500);
    }
  }, [completedRecordings.size, displayImages.length]);

  // Select 4 random images including the completed one when dialog opens
  // Use ref to prevent re-shuffling on re-renders (e.g., after claiming star)
  useEffect(() => {
    if (isOpen && !imagesInitializedRef.current && allImages && allImages.length > 0) {
      imagesInitializedRef.current = true;
      // Always include the completed image
      const otherImages = allImages.filter(img => img.filename !== completedImage.filename);
      
      // Shuffle and take 3 random other images
      const shuffled = [...otherImages].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      // Combine with completed image and shuffle the final array
      const combined = [completedImage, ...selected].sort(() => Math.random() - 0.5);
      setDisplayImages(combined);
    } else if (isOpen && !imagesInitializedRef.current && completedImage) {
      imagesInitializedRef.current = true;
      // Fallback: just show the completed image
      setDisplayImages([completedImage]);
    }
  }, [isOpen, allImages, completedImage]);

  // NOTE: Auto-play audio removed per user request

  // Cleanup on dialog close - reset ref so images are re-shuffled for next game
  useEffect(() => {
    if (!isOpen) {
      imagesInitializedRef.current = false;
      hasAutoTransitionedRef.current = false;
      setCompletedRecordings(new Set());
      setRecordingTimeLeft(3);
      setCurrentRecordingIndex(null);
      setStarClaimed(false);
      setShowBravoDialog(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
  }, [isOpen]);

  // Simulated recording - visual countdown only, no actual audio recording
  const startRecording = (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) return;
    
    setCurrentRecordingIndex(imageIndex);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setCompletedRecordings(prevCompleted => new Set([...prevCompleted, imageIndex]));
          setCurrentRecordingIndex(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCompletedRecordings(new Set());
    setCurrentRecordingIndex(null);
    setRecordingTimeLeft(3);
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

  const handleBravoClose = () => {
    setShowBravoDialog(false);
    setStarClaimed(true);
    onStarClaimed?.(); // Trigger star claim and trophy check when user clicks the button
    onOpenChange(false);
  };

  const handlePlayAudio = (image: ImageData) => {
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let audioFilename = image.audio || `${normalizedWord}.m4a`;
    // Remove trailing "1" before .m4a if present (e.g., "cekin1.m4a" → "cekin.m4a")
    audioFilename = audioFilename.replace(/1\.m4a$/, '.m4a');
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const handleImageClick = (imageIndex: number, word: string) => {
    if (completedRecordings.has(imageIndex) || currentRecordingIndex !== null) {
      return;
    }
    startRecording(imageIndex, word);
  };

  return (
    <>
      <Dialog open={isOpen && !showBravoDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4 py-4">
            <h2 className="text-2xl font-bold text-dragon-green text-center uppercase">ODLIČNO!</h2>
            
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
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(image);
                      }}
                      className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
                      aria-label="Predvajaj besedo"
                    >
                      <Volume2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button onClick={handleClose} variant="outline" className="gap-2 max-w-32">
                ZAPRI
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* BRAVO dialog - shown after claiming star */}
      <Dialog open={showBravoDialog} onOpenChange={handleBravoClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <h1 className="text-5xl font-bold text-dragon-green mb-6">
              BRAVO!
            </h1>
            <img
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
              alt="Zmajček"
              className="w-48 h-48 object-contain mx-auto mb-6"
            />
            <Button
              onClick={handleBravoClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 text-lg"
            >
              ⭐ VZEMI ZVEZDICO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="ZAPRI IGRO"
        description="ČE ZAPREŠ IGRO, NE BOŠ PREJEL ZVEZDICE. ALI SI PREPRIČAN?"
        confirmText="V REDU"
        cancelText="PREKLIČI"
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
};
