import { Mic, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useEffect } from "react";

interface ArticulationRecordButtonProps {
  onRecordingComplete: (audioBase64: string) => void;
  onNext: () => void;
  disabled?: boolean;
  showNext?: boolean;
  onSilenceDetected?: () => void;
  wrongWord?: string;
}

const ArticulationRecordButton = ({
  onRecordingComplete,
  onNext,
  disabled = false,
  showNext = false,
  onSilenceDetected,
  wrongWord,
}: ArticulationRecordButtonProps) => {
  const {
    isRecording,
    countdown,
    startRecording,
    error,
    resetRecording,
    isSilent,
  } = useAudioRecording(5, onRecordingComplete);

  // Reset recording state when showNext changes (moving to next word)
  useEffect(() => {
    if (!showNext) {
      resetRecording();
    }
  }, [showNext, resetRecording]);

  // Notify parent when silence is detected
  useEffect(() => {
    if (isSilent && onSilenceDetected) {
      onSilenceDetected();
    }
  }, [isSilent, onSilenceDetected]);

  // Calculate progress percentage (0 to 100)
  const progressPercent = ((5 - countdown) / 5) * 100;

  // Silence detected - show retry message
  if (isSilent && !isRecording && !showNext) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-red-600 font-medium text-sm">Nisem slišal besede</p>
        <button
          onClick={() => {
            resetRecording();
            startRecording();
          }}
          className={cn(
            "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
            "text-white rounded-full text-lg font-medium shadow-lg",
            "transition-all duration-300 hover:scale-105",
            "w-[220px] h-14 flex items-center justify-center"
          )}
        >
          Poskusi znova
        </button>
      </div>
    );
  }

  // Wrong word detected - show what was heard and retry option
  if (wrongWord && !isRecording) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-red-600 font-medium text-sm">
          Slišano: "{wrongWord}"
        </p>
        <button
          onClick={() => {
            resetRecording();
            startRecording();
          }}
          className={cn(
            "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
            "text-white rounded-full text-lg font-medium shadow-lg",
            "transition-all duration-300 hover:scale-105",
            "w-[220px] h-14 flex items-center justify-center"
          )}
        >
          Poskusi znova
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "bg-gradient-to-r from-red-500 to-red-600",
            "text-white rounded-full text-sm font-medium shadow-lg",
            "w-[220px] h-14 flex items-center justify-center gap-2 px-4"
          )}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Dovoli mikrofon</span>
        </div>
        <button
          onClick={() => {
            resetRecording();
            startRecording();
          }}
          className="text-sm text-teal-600 hover:text-teal-700 underline"
        >
          Poskusi znova
        </button>
      </div>
    );
  }

  if (showNext) {
    return (
      <button
        onClick={onNext}
        className={cn(
          "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
          "text-white rounded-full text-lg font-medium shadow-lg",
          "transition-all duration-300 hover:scale-105",
          "w-[220px] h-14 flex items-center justify-center"
        )}
      >
        Naprej
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    );
  }

  if (isRecording) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full shadow-lg",
          "w-[220px] h-14 bg-gray-200"
        )}
      >
        {/* Progress fill from left to right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Countdown number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {countdown}
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      disabled={disabled || isRecording}
      className={cn(
        "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
        "text-white rounded-full text-lg font-medium shadow-lg",
        "transition-all duration-300 hover:scale-105",
        "w-[220px] h-14 flex items-center justify-center",
        (disabled || isRecording) && "opacity-50 cursor-not-allowed"
      )}
    >
      <Mic className="w-5 h-5 mr-2" />
      Izgovori besedo
    </button>
  );
};

export default ArticulationRecordButton;
