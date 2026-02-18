
import { useRef, useCallback } from "react";

export const useAudioPlayback = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    try {
      console.log('Playing audio from URL:', audioUrl);
      
      // Reuse existing audio element instead of creating new one (Safari fix)
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      const audio = audioRef.current;
      
      // Stop current playback
      audio.pause();
      audio.currentTime = 0;
      
      // Set new source and play
      audio.src = audioUrl;
      audio.load(); // Force load for Safari
      
      audio.play().then(() => {
        console.log('Audio started playing successfully');
      }).catch(error => {
        console.error("Error playing audio:", error);
        // Safari: try resuming AudioContext
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            ctx.resume().then(() => {
              audio.play().catch(e => console.error("Retry play failed:", e));
            });
          }
        } catch (e) {
          console.error("AudioContext resume failed:", e);
        }
      });
    } catch (error) {
      console.error("Error setting up audio playback:", error);
    }
  }, []);

  return {
    audioRef,
    playAudio
  };
};
