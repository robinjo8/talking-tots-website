
import { useRef, useCallback } from "react";

export const useAudioPlayback = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    try {
      console.log('Playing audio from URL:', audioUrl);
      
      // Stop any existing audio by clearing source instead of pausing
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current.load(); // Reset the audio element
      }
      
      // Create a fresh audio element to avoid mobile browser notifications
      audioRef.current = new Audio();
      
      // Disable caching for audio on mobile to prevent old cached versions
      audioRef.current.setAttribute('crossOrigin', 'anonymous');
      
      // Set new source and play
      audioRef.current.src = audioUrl;
      audioRef.current.play().then(() => {
        console.log('Audio started playing successfully');
      }).catch(error => {
        console.error("Error playing audio:", error);
        console.error("Audio URL that failed:", audioUrl);
      });
    } catch (error) {
      console.error("Error setting up audio playback:", error);
      console.error("Audio URL that caused error:", audioUrl);
    }
  }, []);

  return {
    audioRef,
    playAudio
  };
};
