import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  isLoading: boolean;
  error: string | null;
  isMuted: boolean;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
  onLoadStart: () => void;
  onCanPlay: () => void;
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
  onError: () => void;
}

export function VideoPlayer({
  videoRef,
  videoUrl,
  isLoading,
  error,
  isMuted,
  onEnded,
  onPlay,
  onPause,
  onLoadStart,
  onCanPlay,
  onLoadedMetadata,
  onTimeUpdate,
  onError
}: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Nalaganje videa...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white p-4">
            <p className="mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => window.open(videoUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Odpri video direktno
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onError={onError}
        controls={false}
        preload="metadata"
        playsInline
        muted={isMuted}
      >
        <source src={videoUrl} type="video/mp4" />
        Vaš brskalnik ne podpira video predvajanja.
      </video>
    </div>
  );
}