import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { KaceLestveWord } from "@/data/kaceLestveConfig";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useTranscription } from "@/hooks/useTranscription";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

interface KaceLestveWordDialogProps {
  isOpen: boolean;
  word: KaceLestveWord | null;
  // If snake challenge: show special header
  isSnakeChallenge?: boolean;
  playerName?: string;
  difficulty?: string;
  childId?: string;
  logopedistChildId?: string;
  onResult: (accepted: boolean) => void;
  onClose: () => void;
}

export function KaceLestveWordDialog({
  isOpen,
  word,
  isSnakeChallenge = false,
  playerName,
  difficulty,
  childId,
  logopedistChildId,
  onResult,
  onClose,
}: KaceLestveWordDialogProps) {
  const [phase, setPhase] = useState<"idle" | "recording" | "transcribing" | "result">("idle");
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const { playAudio } = useAudioPlayback();
  const { transcribe, isTranscribing } = useTranscription();
  const hasAutoPlayed = useRef(false);

  const handleRecordingComplete = useCallback(async (audioBase64: string) => {
    if (!word) return;
    setPhase("transcribing");

    const result = await transcribe(
      audioBase64,
      word.text,
      word.acceptedVariants,
      childId,
      undefined,
      undefined,
      "C",
      difficulty
    );

    const isAccepted = result?.accepted ?? false;
    setAccepted(isAccepted);
    setPhase("result");
  }, [word, childId, difficulty, transcribe]);

  const { isRecording, countdown, startRecording, resetRecording } = useAudioRecording(4, handleRecordingComplete);

  // Auto-play audio when dialog opens
  useEffect(() => {
    if (isOpen && word && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const audioUrl = `${SUPABASE_URL}/zvocni-posnetki/${word.audio}`;
      setTimeout(() => playAudio(audioUrl), 300);
    }
    if (!isOpen) {
      hasAutoPlayed.current = false;
      setPhase("idle");
      setAccepted(null);
      resetRecording();
    }
  }, [isOpen, word, playAudio, resetRecording]);

  const handlePlayAudio = () => {
    if (!word) return;
    const audioUrl = `${SUPABASE_URL}/zvocni-posnetki/${word.audio}`;
    playAudio(audioUrl);
  };

  const handleStartRecording = async () => {
    setPhase("recording");
    await startRecording();
  };

  const handleConfirmResult = () => {
    onResult(accepted === true);
  };

  if (!word) return null;

  const imageUrl = `${SUPABASE_URL}/slike/${word.image}`;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Header */}
          {isSnakeChallenge ? (
            <div className="text-center">
              <p className="text-2xl mb-1">🐍</p>
              <h2 className="text-lg font-bold text-red-500">IZZIV NA KAČI!</h2>
              <p className="text-sm text-muted-foreground">Pravilno izgovori in ostani na mestu!</p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-lg font-bold text-dragon-green">PONOVI BESEDO!</h2>
              {playerName && (
                <p className="text-sm text-muted-foreground">{playerName}</p>
              )}
            </div>
          )}

          {/* Image */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={word.text}
              className="w-36 h-36 object-contain rounded-xl border-2 border-gray-200"
            />
          </div>

          {/* Word */}
          <p className="text-2xl font-bold text-foreground">{word.text}</p>

          {/* Audio button */}
          <button
            onClick={handlePlayAudio}
            className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>

          {/* Action area */}
          {phase === "idle" && (
            <Button
              onClick={handleStartRecording}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 text-lg rounded-full"
            >
              <Mic className="w-5 h-5 mr-2" />
              SNEMAJ
            </Button>
          )}

          {phase === "recording" && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <p className="text-red-500 font-bold text-2xl">{countdown}</p>
              <p className="text-sm text-muted-foreground">Govori zdaj...</p>
            </div>
          )}

          {phase === "transcribing" && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full border-4 border-dragon-green border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Preverjam izgovorjavo...</p>
            </div>
          )}

          {phase === "result" && (
            <div className="flex flex-col items-center gap-3">
              {accepted ? (
                <>
                  <p className="text-4xl">✅</p>
                  <p className="text-xl font-bold text-dragon-green">BRAVO!</p>
                </>
              ) : (
                <>
                  <p className="text-4xl">❌</p>
                  <p className="text-xl font-bold text-red-500">POSKUSI ZNOVA</p>
                </>
              )}
              <Button
                onClick={handleConfirmResult}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white font-bold px-8"
              >
                NADALJUJ
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
