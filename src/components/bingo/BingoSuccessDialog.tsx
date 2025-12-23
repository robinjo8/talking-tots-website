import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Mic } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BingoWord } from '@/data/bingoWordsR';

interface BingoSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  word: BingoWord;
  isLastWord: boolean;
  onStarClaimed: () => void;
}

export const BingoSuccessDialog: React.FC<BingoSuccessDialogProps> = ({
  isOpen,
  onClose,
  word,
  isLastWord,
  onStarClaimed
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(3);
  const [hasRecorded, setHasRecorded] = useState(false);

  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const { user, selectedChild } = useAuth();

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingDataRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Auto-play audio on open
  useEffect(() => {
    if (isOpen && word.audio) {
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${word.audio}`;
      playAudio(audioUrl);
    }
    
    // Reset state on open
    if (isOpen) {
      setHasRecorded(false);
      setIsRecording(false);
      setRecordingTimeLeft(3);
    }
  }, [isOpen, word, playAudio]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
    }
  }, [isOpen]);

  const saveRecording = async () => {
    if (recordingDataRef.current.length === 0 || !user || !selectedChild) return;

    try {
      const audioBlob = new Blob(recordingDataRef.current, { type: 'audio/webm' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const normalizedWord = word.word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-');
      const filename = `bingo-recording-${normalizedWord}-${timestamp}.webm`;
      const userSpecificPath = `recordings/${user.email}/child-${selectedChild.id}/${filename}`;

      await supabase.storage
        .from('audio-besede')
        .upload(userSpecificPath, audioBlob, { contentType: 'audio/webm' });

    } catch (error) {
      console.error('Error saving recording:', error);
    }

    recordingDataRef.current = [];
  };

  const stopRecording = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    setIsRecording(false);
    setRecordingTimeLeft(3);
    setHasRecorded(true);

    // Recording saved - no toast notification per user request
  }, []);

  const startRecording = async () => {
    if (hasRecorded) return;

    try {
      recordingDataRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingDataRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (recordingDataRef.current.length > 0) {
          await saveRecording();
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTimeLeft(3);

      countdownRef.current = setInterval(() => {
        setRecordingTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Recording started - no toast notification per user request
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Napaka',
        description: 'Ni mogoče dostopati do mikrofona.',
        variant: 'destructive',
      });
    }
  };

  const handlePlayAudio = () => {
    if (word.audio) {
      const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${word.audio}`;
      playAudio(audioUrl);
    }
  };

  const handleImageClick = () => {
    if (!isRecording && !hasRecorded) {
      startRecording();
    }
  };

  const handleContinue = () => {
    onClose();
  };

  const handleClaimStar = () => {
    onStarClaimed();
    toast({
      title: 'Čestitke! 🎉',
      description: 'Zaključil si Bingo in prejel zvezdico! ⭐',
    });
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${word.image}`;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="space-y-4 py-4">
          <h2 className="text-2xl font-bold text-dragon-green text-center">
            {isLastWord && hasRecorded ? '🎉 Čestitke! 🎉' : 'Odlično!'}
          </h2>

          {!hasRecorded && (
            <p className="text-sm text-black text-center">KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO</p>
          )}

          <div className="flex justify-center">
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                hasRecorded ? 'opacity-70 cursor-not-allowed grayscale' : 'hover:scale-105'
              }`}
              onClick={handleImageClick}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={word.word}
                  className={`w-32 h-32 object-cover rounded-lg border-4 ${
                    hasRecorded
                      ? 'border-green-500'
                      : isRecording
                        ? 'border-red-500'
                        : 'border-dragon-green'
                  }`}
                />

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

                {hasRecorded && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>

              <span className="text-lg font-medium text-center text-black">{word.word}</span>
            </div>
          </div>

          {/* Audio playback button */}
          {word.audio && (
            <div className="flex justify-center">
              <Button
                onClick={handlePlayAudio}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
              >
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            {hasRecorded && (
              isLastWord ? (
                <Button
                  onClick={handleClaimStar}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8"
                >
                  ⭐ VZEMI ZVEZDICO
                </Button>
              ) : (
                <Button 
                  onClick={handleContinue} 
                  className="bg-dragon-green hover:bg-dragon-green/90 text-white"
                >
                  NADALJUJ
                </Button>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
