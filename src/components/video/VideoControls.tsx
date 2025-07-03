import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface VideoControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleFullscreen: () => void;
}

export function VideoControls({
  isPlaying,
  isLoading,
  isMuted,
  volume,
  isFullscreen,
  onPlay,
  onPause,
  onStop,
  onRestart,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen
}: VideoControlsProps) {
  const isMobile = useIsMobile();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (isMobile) {
    return (
      <div className="flex justify-center items-center gap-2 p-2">
        <Button
          onClick={onPlay}
          disabled={isPlaying || isLoading}
          variant="outline"
          size="icon"
        >
          <Play className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onPause}
          disabled={!isPlaying || isLoading}
          variant="outline"
          size="icon"
        >
          <Pause className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onStop}
          disabled={isLoading}
          variant="outline"
          size="icon"
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onRestart}
          disabled={isLoading}
          variant="outline"
          size="icon"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          {showVolumeSlider && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-3 shadow-lg z-50 flex flex-col items-center gap-2">
              <Button
                onClick={onToggleMute}
                disabled={isLoading}
                variant="outline"
                size="icon"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <div className="h-20 flex items-center">
                <Slider
                  orientation="vertical"
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => onVolumeChange(value[0])}
                  max={1}
                  step={0.1}
                  disabled={isLoading}
                  className="h-16"
                />
              </div>
            </div>
          )}
          <Button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            disabled={isLoading}
            variant="outline"
            size="icon"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Button
          onClick={onToggleFullscreen}
          disabled={isLoading}
          variant="outline"
          size="icon"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>

      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Playback Controls */}
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

      {/* Volume and Fullscreen Controls */}
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleMute}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={1}
              step={0.1}
              disabled={isLoading}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <Button
          onClick={onToggleFullscreen}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}