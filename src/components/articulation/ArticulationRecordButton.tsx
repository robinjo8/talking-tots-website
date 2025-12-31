import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticulationRecordButtonProps {
  onRecordingComplete: () => void;
  disabled?: boolean;
}

const ArticulationRecordButton = ({
  onRecordingComplete,
  disabled = false,
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

  return (
    <div className="flex flex-col items-center gap-4">
      {isRecording ? (
        <div className="flex flex-col items-center gap-3">
          {/* Recording indicator */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            {/* Countdown ring */}
            <svg className="absolute inset-0 w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={226}
                strokeDashoffset={226 * (1 - countdown / 5)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
          <p className="text-xl font-bold text-red-500">
            {countdown}s
          </p>
          <p className="text-sm text-gray-600">Snemanje...</p>
        </div>
      ) : (
        <Button
          onClick={startRecording}
          disabled={disabled}
          className={cn(
            "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
            "text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg",
            "transition-all duration-300 hover:scale-105",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          size="lg"
        >
          <Mic className="w-5 h-5 mr-2" />
          Izgovori besedo
        </Button>
      )}
    </div>
  );
};

export default ArticulationRecordButton;
