// Generic Video Navodila component
// Replaces 9 individual VideoNavodilaCrka* files
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoProgressBar } from "@/components/video/VideoProgressBar";
import { VideoControls } from "@/components/video/VideoControls";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenericVideoNavodilaProps {
  title: string;
  videoUrl: string;
  displayLetter: string;
}

export function GenericVideoNavodila({ title, videoUrl, displayLetter }: GenericVideoNavodilaProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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

  return (
    <div className={cn(
      "bg-dragon-green",
      isMobile ? "fixed inset-0 overflow-hidden flex flex-col" : "min-h-screen"
    )}>
      <Header />
      
      <div className={cn(
        "container max-w-4xl mx-auto px-4",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Title Section */}
        <div className={cn("text-center", isMobile ? "mb-2" : "mb-8")}>
          <h1 className={cn(
            "font-bold text-white",
            isMobile ? "text-2xl mb-1" : "text-4xl md:text-5xl mb-2"
          )}>
            Glas {displayLetter}
          </h1>
          {!isMobile && (
            <p className="text-white/80 text-lg mt-2">
              Poglej video navodila za pravilno izgovorjavo glasu {displayLetter}
            </p>
          )}
        </div>
        
        {/* Video Card */}
        <div className={cn(
          "bg-background rounded-xl shadow-md border-0",
          isMobile ? "p-3 flex-1 flex flex-col overflow-hidden" : "p-6 md:p-8"
        )}>
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
          />
          
          <VideoProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handlers.seekToTime}
            isSeekingMode={isSeekingMode}
            setIsSeekingMode={setIsSeekingMode}
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
          />
        </div>
      </div>

      {/* Floating back button */}
      <button
        onClick={() => navigate("/video-navodila")}
        className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
      >
        <ArrowLeft className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
