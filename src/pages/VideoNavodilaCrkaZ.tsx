import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoProgressBar } from "@/components/video/VideoProgressBar";
import { VideoControls } from "@/components/video/VideoControls";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { PageHeader } from "@/components/PageHeader";

const VideoNavodilaCrkaZ = () => {
  const videoUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20Z%20(video).mp4";
  
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
      <PageHeader title="Video navodila - Z" backPath="/video-navodila" />
      
      <div className="container max-w-4xl mx-auto pt-4 pb-20 px-4">
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
};

export default VideoNavodilaCrkaZ;
