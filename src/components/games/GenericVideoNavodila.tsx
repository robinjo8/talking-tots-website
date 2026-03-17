
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoProgressBar } from "@/components/video/VideoProgressBar";
import { VideoControls } from "@/components/video/VideoControls";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

interface GenericVideoNavodilaProps {
  title: string;
  videoUrl: string;
  displayLetter: string;
  backPath?: string;
}

export function GenericVideoNavodila({ title, videoUrl, displayLetter, backPath = "/video-navodila" }: GenericVideoNavodilaProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVideoHeight, setMaxVideoHeight] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    videoRef,
    isPlaying,
    setIsPlaying,
    isLoading,
    error,
    isMuted,
    volume,
    isFullscreen,
    currentTime,
    duration,
    isSeekingMode,
    setIsSeekingMode,
    handlers
  } = useVideoPlayer(videoUrl);

  // Calculate available height for video
  useEffect(() => {
    const calculateHeight = () => {
      const controlsHeight = isMobile ? 0 : 16;
      const padding = isMobile ? 0 : 48;
      const vh = window.visualViewport?.height || window.innerHeight;
      setMaxVideoHeight(vh - controlsHeight - padding);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    window.visualViewport?.addEventListener('resize', calculateHeight);
    return () => {
      window.removeEventListener('resize', calculateHeight);
      window.visualViewport?.removeEventListener('resize', calculateHeight);
    };
  }, [isMobile]);

  // Auto-hide overlay for all devices
  const resetOverlayTimer = useCallback(() => {
    setShowOverlay(true);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    if (isPlaying) {
      overlayTimerRef.current = setTimeout(() => setShowOverlay(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      resetOverlayTimer();
    } else {
      setShowOverlay(true);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    }
    return () => { if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current); };
  }, [isPlaying, resetOverlayTimer]);

  const handleInteraction = () => {
    resetOverlayTimer();
  };


  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      

      {/* Video area - fills remaining space */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center pb-0 px-0 md:pb-2 md:px-8"
        onClick={handleInteraction}
        onMouseMove={handleInteraction}
      >
        {/* Video container with overlay controls */}
        <div className="relative w-full flex items-center justify-center" style={{ maxHeight: maxVideoHeight > 0 ? maxVideoHeight : undefined }}>
          <VideoPlayer
            videoRef={videoRef}
            videoUrl={videoUrl}
            isLoading={isLoading}
            error={error}
            isMuted={isMuted}
            onEnded={handlers.handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadStart={handlers.handleLoadStart}
            onCanPlay={handlers.handleCanPlay}
            onLoadedMetadata={handlers.handleLoadedMetadata}
            onTimeUpdate={handlers.handleTimeUpdate}
            onError={handlers.handleError}
            maxHeight={maxVideoHeight}
            isMobile={isMobile}
          >
            {/* Overlay controls for all devices */}
            <div
              className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="bg-black/40 backdrop-blur-sm px-2 py-1.5 md:px-6 md:py-3 rounded-b-lg">
                <VideoProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handlers.seekToTime}
                  isSeekingMode={isSeekingMode}
                  setIsSeekingMode={setIsSeekingMode}
                  compact
                />
                <VideoControls
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  isMuted={isMuted}
                  volume={volume}
                  isFullscreen={isFullscreen}
                  onPlay={handlers.handlePlay}
                  onPause={handlers.handlePause}
                  onStop={handlers.handleStop}
                  onRestart={handlers.handleRestart}
                  onToggleMute={handlers.handleToggleMute}
                  onVolumeChange={handlers.handleVolumeChange}
                  onToggleFullscreen={handlers.handleToggleFullscreen}
                  overlay
                />
              </div>
            </div>
          </VideoPlayer>
        </div>
      </div>

    </div>
  );
}
