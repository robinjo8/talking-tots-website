
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
      
      // Create a fresh audio element
      audioRef.current = new Audio();
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('loadstart', () => console.log('Audio load started'));
      audioRef.current.addEventListener('canplay', () => console.log('Audio can play'));
      audioRef.current.addEventListener('error', (e) => console.error('Audio element error:', e));
      
      // Don't set crossOrigin as it might cause CORS issues with Supabase
      // audioRef.current.setAttribute('crossOrigin', 'anonymous');
      
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
