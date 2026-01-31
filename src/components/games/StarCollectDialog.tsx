import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, Star } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ImageData {
  filename: string;
  word: string;
  audio?: string;
}

interface StarCollectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImageData;
  starNumber: number; // 1, 2, 3, or 4
  onComplete: () => void;
}

export const StarCollectDialog: React.FC<StarCollectDialogProps> = ({
  isOpen,
  onOpenChange,
  image,
  starNumber,
  onComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { playAudio } = useAudioPlayback();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && image) {
      completedRef.current = false;
      setRecordingComplete(false);
      setIsRecording(false);
      setRecordingTimeLeft(3);
      
      const normalizedWord = image.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const audioFilename = image.audio || `${normalizedWord}.m4a`;
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
      playAudio(audioUrl);
    }
  }, [isOpen, image, playAudio]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setIsRecording(false);
      setRecordingTimeLeft(3);
      setRecordingComplete(false);
    }
  }, [isOpen]);

  const startRecording = () => {
    if (isRecording || recordingComplete) return;
    
    setIsRecording(true);
    setRecordingTimeLeft(3);

    countdownRef.current = setInterval(() => {
      setRecordingTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setIsRecording(false);
          setRecordingComplete(true);
          
          // Auto-close dialog and call onComplete after a short delay
          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(() => {
              onComplete();
              onOpenChange(false);
            }, 800);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePlayAudio = () => {
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const audioFilename = image.audio || `${normalizedWord}.m4a`;
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${image.filename}`;

  const handleClose = () => {
    if (!recordingComplete) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  // Render star icons
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 4; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 ${i <= starNumber ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-1">
            {renderStars()}
          </div>
          
          <h2 className="text-xl font-bold text-dragon-green text-center uppercase">
            ODLIČNO! {starNumber}. ZVEZDICA JE TVOJA!
          </h2>
          
          <p className="text-sm text-black text-center uppercase">
            KLIKNI NA SLIKO IN PONOVI BESEDO
          </p>
          
          <div className="flex flex-col items-center space-y-3">
            <div 
              className={`cursor-pointer transition-all ${
                recordingComplete ? 'opacity-50' : 'hover:scale-105'
              }`}
              onClick={startRecording}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={image.word}
                  className={`w-28 h-28 object-cover rounded-lg border-4 ${
                    recordingComplete ? 'border-gray-400 grayscale' : 
                    isRecording ? 'border-red-500' : 'border-dragon-green'
                  }`}
                />
                
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                    <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <Mic className="w-6 h-6" />
                    </div>
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {recordingTimeLeft}
                  </div>
                )}
                
                {recordingComplete && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 rounded-lg">
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <span className={`text-lg font-bold text-center ${
              recordingComplete ? 'text-gray-400' : 'text-black'
            }`}>
              {image.word.toUpperCase()}
            </span>
            
            <button
              onClick={handlePlayAudio}
              className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
              aria-label="Predvajaj besedo"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      open={showConfirmDialog}
      onOpenChange={setShowConfirmDialog}
      title="OPOZORILO"
      description="ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
      confirmText="DA"
      cancelText="NE"
      onConfirm={() => {
        setShowConfirmDialog(false);
        onOpenChange(false);
      }}
      onCancel={() => setShowConfirmDialog(false)}
    />
    </>
  );
};
