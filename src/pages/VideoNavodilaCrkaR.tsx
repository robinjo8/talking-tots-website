import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Square, RotateCcw, Loader2, ExternalLink, Volume2, VolumeX, Gauge } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const VideoNavodilaCrkaR = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeekingMode, setIsSeekingMode] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<{
    duration?: number;
    hasAudio?: boolean;
    currentTime?: number;
  }>({});
  
  const videoUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/crka-R.mp4";

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing video:", error);
        setError("Napaka pri predvajanju videa");
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleRestart = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error restarting video:", error);
        setError("Napaka pri ponovnem predvajanju");
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleLoadStart = () => {
    console.log("Video loading started");
    setIsLoading(true);
    setError(null);
  };

  const handleCanPlay = () => {
    console.log("Video can start playing");
    setIsLoading(false);
  };

  const handleError = () => {
    console.error("Video failed to load");
    setError("Video se ni mogel naložiti. Preverite internetno povezavo.");
    setIsLoading(false);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      console.log(`Playback rate changed to: ${rate}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const hasAudioTracks = !!(video as any).webkitAudioDecodedByteCount || 
                            !!(video as any).audioTracks?.length ||
                            !!(video as any).mozHasAudio;
      
      setDuration(video.duration);
      setVideoMetadata({
        duration: video.duration,
        hasAudio: hasAudioTracks,
        currentTime: video.currentTime
      });
      
      // Ensure playback rate is 1.0
      video.playbackRate = 1.0;
      setPlaybackRate(1.0);
      
      console.log("Video metadata loaded:", {
        duration: video.duration,
        hasAudio: hasAudioTracks,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        playbackRate: video.playbackRate
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeekingMode) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      setVideoMetadata(prev => ({
        ...prev,
        currentTime: time
      }));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeekingMode(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSeekingMode && videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseUp = () => {
    setIsSeekingMode(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-unmute on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (videoRef.current && isMuted) {
        handleToggleMute();
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Video navodila - Črka R" backPath="/video-navodila" />
      
      <div className="container max-w-4xl mx-auto pt-8 pb-20 px-4">
        <Card className="mb-6">
          <CardContent className="p-6">
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
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onError={handleError}
                controls={false}
                preload="metadata"
                playsInline
                muted={isMuted}
              >
                <source src={videoUrl} type="video/mp4" />
                Vaš brskalnik ne podpira video predvajanja.
              </video>
            </div>
            
            {/* Video Progress Bar */}
            {duration > 0 && (
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
            )}
            
            {/* Playback Controls */}
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                onClick={handlePlay}
                disabled={isPlaying || isLoading}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="h-5 w-5 mr-2" />
                Predvajaj
              </Button>
              
              <Button
                onClick={handlePause}
                disabled={!isPlaying || isLoading}
                variant="outline"
                size="lg"
              >
                <Pause className="h-5 w-5 mr-2" />
                Premor
              </Button>
              
              <Button
                onClick={handleStop}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                <Square className="h-5 w-5 mr-2" />
                Ustavi
              </Button>
              
              <Button
                onClick={handleRestart}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Ponovi
              </Button>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default VideoNavodilaCrkaR;