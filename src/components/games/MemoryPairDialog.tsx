import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Star, Volume2 } from "lucide-react";
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface MemoryPairDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onUnmatch: () => void;
  onStarClaimed?: () => void;
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
  onStarClaimed,
  pairNumber,
  totalPairs,
  imageUrl,
  word,
  audioUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
    }
  }, [isOpen]);

  // Simulated recording - visual countdown only, no actual audio recording
  const startRecording = () => {
    if (hasRecorded || isRecording) return;
    
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
          setHasRecorded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
      onStarClaimed?.();
    }
    onContinue();
  };

  const handleReset = () => {
    // Clear any running countdown timer
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    // Reset recording state to allow re-recording
    setHasRecorded(false);
    setIsRecording(false);
    setRecordingTimeLeft(3);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dragon-green text-center">
            Par {pairNumber} od {totalPairs}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-black text-center">
            KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO
          </p>
          
          {/* Image container - same structure as MatchingCompletionDialog */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div 
                className={`cursor-pointer transition-all ${
                  hasRecorded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
                onClick={handleImageClick}
              >
                <div className="relative">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={word || "Spominska kartica"}
                      className={`w-20 h-20 object-cover rounded-xl border-2 ${
                        hasRecorded ? 'border-gray-400 grayscale' : 
                        isRecording ? 'border-red-500' : 'border-dragon-green'
                      }`}
                    />
                  )}
                  
                  {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  
                  {isRecording && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {recordingTimeLeft}
                    </div>
                  )}
                </div>
              </div>
              
              {word && (
                <span className={`text-sm font-medium text-center ${
                  hasRecorded ? 'text-gray-400' : 'text-black'
                }`}>
                  {word.toUpperCase()}
                </span>
              )}
              
              {/* Audio button directly under word - same as MatchingCompletionDialog */}
              <Button
                onClick={() => audioUrl && playAudio(audioUrl)}
                disabled={!audioUrl}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
              >
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Action buttons - always visible, disabled until recorded */}
          <div className="flex justify-center gap-3">
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="gap-2 flex-1 max-w-28"
              disabled={!hasRecorded}
            >
              Ponovi
            </Button>
            <Button 
              onClick={handleContinue}
              className={`gap-2 flex-1 ${
                isLastPair 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white max-w-32' 
                  : 'bg-dragon-green hover:bg-dragon-green/90 text-white max-w-28'
              }`}
              disabled={!hasRecorded}
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