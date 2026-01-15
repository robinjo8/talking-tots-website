import { Mic, ArrowRight, AlertCircle, Check } from "lucide-react";
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
  isNoise?: boolean;
  isTranscribing?: boolean;
  feedbackMessage?: string;
}

const ArticulationRecordButton = ({
  onRecordingComplete,
  onNext,
  disabled = false,
  showNext = false,
  onSilenceDetected,
  wrongWord,
  isNoise = false,
  isTranscribing = false,
  feedbackMessage,
}: ArticulationRecordButtonProps) => {
  const {
    isRecording,
    countdown,
    startRecording,
    error,
    resetRecording,
    isSilent,
  } = useAudioRecording(3, onRecordingComplete);

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
  const progressPercent = ((3 - countdown) / 3) * 100;

  // Wrapper for consistent height
  const renderContent = () => {
    // Transcribing state
    if (isTranscribing) {
      return (
        <>
          <div className="h-[44px]" />
          <div className="w-[220px] h-14 flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
            <span className="text-gray-600">Preverjam...</span>
          </div>
        </>
      );
    }

    // Silence detected - show retry message
    if (isSilent && !isRecording && !showNext) {
      return (
        <>
          <div className="h-[44px] flex items-center justify-center">
            <p className="text-red-600 font-medium text-sm">Zvok ni bil zaznan</p>
          </div>
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
        </>
      );
    }

    // Noise detected - show noise message and retry option
    if (isNoise && !isRecording) {
      return (
        <>
          <div className="h-[44px] flex items-center justify-center">
            <p className="text-red-600 font-medium text-sm">Zaznan je bil šum</p>
          </div>
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
        </>
      );
    }

    // Wrong word detected - show what was heard and retry option
    if (wrongWord && !isRecording) {
      return (
        <>
          <div className="h-[44px] flex items-center justify-center">
            <p className="text-red-600 font-medium text-sm">
              Slišano: "{wrongWord}"
            </p>
          </div>
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
        </>
      );
    }

    if (error) {
      return (
        <>
          <div className="h-[44px]" />
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
            className="text-sm text-teal-600 hover:text-teal-700 underline mt-1"
          >
            Poskusi znova
          </button>
        </>
      );
    }

    // Show next button with feedback
    if (showNext) {
      return (
        <>
          <div className="h-[44px] flex items-center justify-center">
            {feedbackMessage && (
              <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-green-100 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium text-sm">{feedbackMessage}</span>
              </div>
            )}
          </div>
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
        </>
      );
    }

    // Recording in progress
    if (isRecording) {
      return (
        <>
          <div className="h-[44px]" />
          <div
            className={cn(
              "relative overflow-hidden rounded-full shadow-lg",
              "w-[220px] h-14 bg-gray-200"
            )}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white drop-shadow-md">
                {countdown}
              </span>
            </div>
          </div>
        </>
      );
    }

    // Default - start recording button
    return (
      <>
        <div className="h-[44px]" />
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
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 min-h-[100px]">
      {renderContent()}
    </div>
  );
};

export default ArticulationRecordButton;
