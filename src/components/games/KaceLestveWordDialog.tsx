import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mic, Volume2, ArrowRight, Check, AlertCircle } from "lucide-react";
import { KaceLestveWord } from "@/data/kaceLestveConfig";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useTranscription } from "@/hooks/useTranscription";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { cn } from "@/lib/utils";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";
const RECORDING_DURATION = 4;

interface KaceLestveWordDialogProps {
  isOpen: boolean;
  word: KaceLestveWord | null;
  isSnakeChallenge?: boolean;
  playerName?: string;
  difficulty?: string;
  childId?: string;
  logopedistChildId?: string;
  onResult: (accepted: boolean) => void;
  onClose: () => void;
}

type Phase = "idle" | "recording" | "transcribing" | "success" | "fail";

export function KaceLestveWordDialog({
  isOpen,
  word,
  isSnakeChallenge = false,
  playerName,
  difficulty,
  childId,
  onResult,
  onClose,
}: KaceLestveWordDialogProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const { playAudio } = useAudioPlayback();
  const { transcribe } = useTranscription();
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

    if (result?.accepted) {
      setWrongWord(null);
      setPhase("success");
    } else {
      setWrongWord(result?.transcribedText || null);
      setPhase("fail");
    }
  }, [word, childId, difficulty, transcribe]);

  const {
    isRecording,
    countdown,
    startRecording,
    resetRecording,
    isSilent,
    error,
  } = useAudioRecording(RECORDING_DURATION, handleRecordingComplete);

  const progressPercent = ((RECORDING_DURATION - countdown) / RECORDING_DURATION) * 100;

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
      setWrongWord(null);
      resetRecording();
    }
  }, [isOpen, word, playAudio, resetRecording]);

  const handlePlayAudio = () => {
    if (!word) return;
    playAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
  };

  const handleStartRecording = async () => {
    setPhase("recording");
    await startRecording();
  };

  const handleRetry = () => {
    setPhase("idle");
    setWrongWord(null);
    resetRecording();
  };

  if (!word) return null;

  const imageUrl = `${SUPABASE_URL}/slike/${word.image}`;

  const renderActionArea = () => {
    // Transcribing
    if (phase === "transcribing") {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          <span className="text-gray-600 text-sm">Preverjam...</span>
        </div>
      );
    }

    // Recording in progress — animated red progress bar
    if (phase === "recording") {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="h-[44px]" />
          <div className="relative overflow-hidden rounded-full shadow-lg bg-gray-200 w-[220px] h-14">
            <div
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-white drop-shadow-md text-2xl">{countdown}</span>
            </div>
          </div>
        </div>
      );
    }

    // Silence detected
    if (isSilent && phase === "fail") {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="flex items-center justify-center h-[44px]">
            <p className="text-red-600 font-medium text-sm">Zvok ni bil zaznan</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 w-[220px] h-14 text-lg flex items-center justify-center"
          >
            Poskusi znova
          </button>
        </div>
      );
    }

    // Error (mic permission)
    if (error) {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="h-[44px]" />
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-medium shadow-lg w-[220px] h-14 flex items-center justify-center gap-2 px-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Dovoli mikrofon</span>
          </div>
          <button onClick={handleRetry} className="text-sm text-teal-600 hover:text-teal-700 underline mt-1">
            Poskusi znova
          </button>
        </div>
      );
    }

    // Success
    if (phase === "success") {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-green-100 text-green-700 h-[44px]">
            <Check className="w-5 h-5" />
            <span className="font-medium text-sm">BRAVO!</span>
          </div>
          <button
            onClick={() => onResult(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 w-[220px] h-14 text-lg flex items-center justify-center"
          >
            Nadaljuj
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      );
    }

    // Fail — show what was heard + retry
    if (phase === "fail") {
      return (
        <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
          <div className="flex items-center justify-center h-[44px]">
            {wrongWord ? (
              <p className="text-red-600 font-medium text-sm">Slišano: "{wrongWord}"</p>
            ) : (
              <p className="text-red-600 font-medium text-sm">Napačna izgovorjava</p>
            )}
          </div>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 w-[220px] h-14 text-lg flex items-center justify-center"
          >
            Poskusi znova
          </button>
        </div>
      );
    }

    // Idle — start recording
    return (
      <div className="flex flex-col items-center gap-2 min-h-[100px] justify-center">
        <div className="h-[44px]" />
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className={cn(
            "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
            "text-white rounded-full font-medium shadow-lg",
            "transition-all duration-300 hover:scale-105",
            "w-[220px] h-14 text-lg flex items-center justify-center",
            isRecording && "opacity-50 cursor-not-allowed"
          )}
        >
          <Mic className="w-5 h-5 mr-2" />
          Izgovori besedo
        </button>
      </div>
    );
  };

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
          <img
            src={imageUrl}
            alt={word.text}
            className="w-36 h-36 object-contain rounded-xl border-2 border-gray-200"
          />

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
          {renderActionArea()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
