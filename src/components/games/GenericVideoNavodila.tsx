// Generic Video Navodila component
// Replaces 9 individual VideoNavodilaCrka* files
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoProgressBar } from "@/components/video/VideoProgressBar";
import { VideoControls } from "@/components/video/VideoControls";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";

interface GenericVideoNavodilaProps {
  title: string;
  videoUrl: string;
  displayLetter: string;
}

export function GenericVideoNavodila({ title, videoUrl, displayLetter }: GenericVideoNavodilaProps) {
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
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Črka {displayLetter}
          </h1>
          <div className="w-24 h-1 bg-app-yellow mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground text-lg">
            Poglej video navodila za pravilno izgovorjavo črke {displayLetter}
          </p>
        </div>
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>
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
