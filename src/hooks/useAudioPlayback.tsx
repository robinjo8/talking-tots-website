
import { useRef, useCallback } from "react";

export const useAudioPlayback = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    try {
      // Stop any existing audio by clearing source instead of pausing
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current.load(); // Reset the audio element
      }
      
      // Create a fresh audio element to avoid mobile browser notifications
      audioRef.current = new Audio();
      
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
