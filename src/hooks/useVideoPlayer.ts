import { useRef, useState, useEffect } from "react";

interface VideoMetadata {
  duration?: number;
  hasAudio?: boolean;
  currentTime?: number;
}

export const useVideoPlayer = (videoUrl: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeekingMode, setIsSeekingMode] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({});

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

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      videoRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
      
      // Auto unmute if volume is increased
      if (clampedVolume > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleToggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          await (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          await (videoRef.current as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
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
      setVolume(video.volume);
      setVideoMetadata({
        duration: video.duration,
        hasAudio: hasAudioTracks,
        currentTime: video.currentTime
      });
      
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

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    isLoading,
    error,
    isMuted,
    volume,
    isFullscreen,
    playbackRate,
    currentTime,
    duration,
    isSeekingMode,
    setIsSeekingMode,
    videoMetadata,
    handlers: {
      handlePlay,
      handlePause,
      handleStop,
      handleRestart,
      handleVideoEnd,
      handleLoadStart,
      handleCanPlay,
      handleError,
      handleToggleMute,
      handleVolumeChange,
      handleToggleFullscreen,
      handlePlaybackRateChange,
      handleLoadedMetadata,
      handleTimeUpdate,
      seekToTime,
    }
  };
};