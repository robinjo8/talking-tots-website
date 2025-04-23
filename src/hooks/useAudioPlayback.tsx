
import { useRef, useCallback } from "react";

export const useAudioPlayback = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Reset the audio element
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Set new source and play
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
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
