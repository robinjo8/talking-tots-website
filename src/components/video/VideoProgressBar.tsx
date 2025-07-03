import React from "react";

interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isSeekingMode: boolean;
  setIsSeekingMode: (seeking: boolean) => void;
}

export function VideoProgressBar({
  currentTime,
  duration,
  onSeek,
  isSeekingMode,
  setIsSeekingMode
}: VideoProgressBarProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      onSeek(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeekingMode(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSeekingMode && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
      onSeek(newTime);
    }
  };

  const handleProgressMouseUp = () => {
    setIsSeekingMode(false);
  };

  if (duration === 0) return null;

  return (
    <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div 
        className="relative w-full h-2 bg-muted rounded-full cursor-pointer"
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
        onMouseMove={handleProgressMouseMove}
        onMouseUp={handleProgressMouseUp}
        onMouseLeave={handleProgressMouseUp}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-150"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-sm cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 8px)` }}
        />
      </div>
    </div>
  );
}