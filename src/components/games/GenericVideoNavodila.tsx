// Generic Video Navodila component
// Replaces 9 individual VideoNavodilaCrka* files
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoProgressBar } from "@/components/video/VideoProgressBar";
import { VideoControls } from "@/components/video/VideoControls";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Glas {displayLetter}
          </h1>
          <div className="w-24 h-1 bg-app-yellow mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground text-lg">
            Poglej video navodila za pravilno izgovorjavo glasu {displayLetter}
          </p>
        </div>
        
        {/* Mobile Back Button */}
        {isMobile && (
          <Button
            onClick={() => navigate("/video-navodila")}
            className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
            size="icon"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </Button>
        )}
        <Card className="mb-6">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
