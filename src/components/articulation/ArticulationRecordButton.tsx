import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticulationRecordButtonProps {
  onRecordingComplete: () => void;
  onNext: () => void;
  disabled?: boolean;
  showNext?: boolean;
}

const ArticulationRecordButton = ({
  onRecordingComplete,
  onNext,
  disabled = false,
  showNext = false,
}: ArticulationRecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const startRecording = useCallback(() => {
    if (disabled || isRecording) return;
    setIsRecording(true);
    setCountdown(5);
  }, [disabled, isRecording]);

  useEffect(() => {
    if (!isRecording) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Recording complete
      setIsRecording(false);
      setCountdown(5);
      onRecordingComplete();
    }
  }, [isRecording, countdown, onRecordingComplete]);

  // Calculate progress percentage (0 to 100)
  const progressPercent = ((5 - countdown) / 5) * 100;

  if (showNext) {
    return (
      <Button
        onClick={onNext}
        className={cn(
          "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
          "text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg",
          "transition-all duration-300 hover:scale-105 min-w-[220px]"
        )}
        size="lg"
      >
        Naprej
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    );
  }

  if (isRecording) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full min-w-[220px] h-14",
          "bg-gray-200 shadow-lg"
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
    <Button
      onClick={startRecording}
      disabled={disabled}
      className={cn(
        "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
        "text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg",
        "transition-all duration-300 hover:scale-105 min-w-[220px]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      size="lg"
    >
      <Mic className="w-5 h-5 mr-2" />
      Izgovori besedo
    </Button>
  );
};

export default ArticulationRecordButton;
