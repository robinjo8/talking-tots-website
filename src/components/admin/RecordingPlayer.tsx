import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface RecordingPlayerProps {
  word: string;
  url: string;
}

export function RecordingPlayer({ word, url }: RecordingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <audio
        ref={audioRef}
        src={url}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <span className="font-medium text-foreground min-w-[80px]">{word}</span>
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlay}
          className="h-8 w-8 p-0"
          aria-label={isPlaying ? 'Pavza' : 'Predvajaj'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          className="h-8 w-8 p-0"
          aria-label="Ustavi"
        >
          <Square className="h-3 w-3" />
        </Button>
      </div>
      
      {isPlaying && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Predvaja...</span>
        </div>
      )}
    </div>
  );
}
