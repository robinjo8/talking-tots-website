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
    if (videoRef.current) {
      setVideoMetadata(prev => ({
        ...prev,
        currentTime: videoRef.current!.currentTime
      }));
    }
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
            
            {/* Video Information */}
            {videoMetadata.duration && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Trajanje:</span> {Math.round(videoMetadata.duration || 0)}s
                  </div>
                  <div>
                    <span className="font-medium">Čas:</span> {Math.round(videoMetadata.currentTime || 0)}s
                  </div>
                  <div>
                    <span className="font-medium">Hitrost:</span> {playbackRate}x
                  </div>
                  <div>
                    <span className="font-medium">Zvok:</span> {videoMetadata.hasAudio ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 text-center text-sm text-muted-foreground">
              Video URL: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Testiraj direktno
              </a>
            </div>
            
            {/* Playback Controls */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
              <Button
                onClick={handlePlay}
                disabled={isPlaying || isLoading}
                className="bg-app-purple hover:bg-app-purple/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Predvajaj
              </Button>
              
              <Button
                onClick={handlePause}
                disabled={!isPlaying || isLoading}
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-2" />
                Premor
              </Button>
              
              <Button
                onClick={handleStop}
                disabled={isLoading}
                variant="outline"
              >
                <Square className="h-4 w-4 mr-2" />
                Ustavi
              </Button>
              
              <Button
                onClick={handleRestart}
                disabled={isLoading}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Ponovi
              </Button>

              <Button
                onClick={handleToggleMute}
                disabled={isLoading}
                variant="outline"
              >
                {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isMuted ? 'Vklopi zvok' : 'Izklopi zvok'}
              </Button>
            </div>

            {/* Playback Rate Controls */}
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                <span className="text-sm font-medium">Hitrost:</span>
              </div>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <Button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  disabled={isLoading}
                  variant={playbackRate === rate ? "default" : "outline"}
                  size="sm"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default VideoNavodilaCrkaR;