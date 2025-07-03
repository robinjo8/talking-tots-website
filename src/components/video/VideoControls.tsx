import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export function VideoControls({
  isPlaying,
  isLoading,
  onPlay,
  onPause,
  onStop,
  onRestart
}: VideoControlsProps) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <Button
        onClick={onPlay}
        disabled={isPlaying || isLoading}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Play className="h-5 w-5 mr-2" />
        Predvajaj
      </Button>
      
      <Button
        onClick={onPause}
        disabled={!isPlaying || isLoading}
        variant="outline"
        size="lg"
      >
        <Pause className="h-5 w-5 mr-2" />
        Premor
      </Button>
      
      <Button
        onClick={onStop}
        disabled={isLoading}
        variant="outline"
        size="lg"
      >
        <Square className="h-5 w-5 mr-2" />
        Ustavi
      </Button>
      
      <Button
        onClick={onRestart}
        disabled={isLoading}
        variant="outline"
        size="lg"
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        Ponovi
      </Button>
    </div>
  );
}