
import { useRef } from 'react';

export const useAudioPlayback = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  return {
    audioRef,
    playAudio
  };
};
