import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface BackgroundMusicContextType {
  // Context can be extended with controls if needed in the future
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType>({});

export const useBackgroundMusic = () => useContext(BackgroundMusicContext);

interface BackgroundMusicProviderProps {
  children: ReactNode;
}

const MUSIC_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/glasba/kids-happy-background-music-401734.mp3";

// Routes where background music should play
const MUSIC_ROUTES = [
  '/moje-aplikacije',
  '/govorne-igre',
  '/govorno-jezikovne-vaje'
];

export function BackgroundMusicProvider({ children }: BackgroundMusicProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const location = useLocation();

  const TARGET_VOLUME = 0.3;
  const FADE_DURATION = 1000; // 1 second fade
  const FADE_STEPS = 50;

  // Clear any ongoing fade animation
  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // Fade in effect
  const fadeIn = (audio: HTMLAudioElement) => {
    clearFade();
    audio.volume = 0;
    
    audio.play().catch(error => {
      console.log('Background music autoplay prevented:', error);
    });

    const step = TARGET_VOLUME / FADE_STEPS;
    const interval = FADE_DURATION / FADE_STEPS;

    fadeIntervalRef.current = window.setInterval(() => {
      if (audio.volume < TARGET_VOLUME) {
        audio.volume = Math.min(audio.volume + step, TARGET_VOLUME);
      } else {
        clearFade();
      }
    }, interval);
  };

  // Fade out effect
  const fadeOut = (audio: HTMLAudioElement) => {
    clearFade();
    
    const step = TARGET_VOLUME / FADE_STEPS;
    const interval = FADE_DURATION / FADE_STEPS;

    fadeIntervalRef.current = window.setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(audio.volume - step, 0);
      } else {
        audio.volume = 0;
        audio.pause();
        clearFade();
      }
    }, interval);
  };

  useEffect(() => {
    // Initialize audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    return () => {
      clearFade();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentPath = location.pathname;
    const shouldPlay = MUSIC_ROUTES.includes(currentPath);

    if (shouldPlay) {
      // Fade in music if on a valid route
      if (audio.paused) {
        fadeIn(audio);
      }
    } else {
      // Fade out music on other routes
      if (!audio.paused) {
        fadeOut(audio);
      }
    }

    // Cleanup on unmount
    return () => {
      if (audio && !MUSIC_ROUTES.includes(location.pathname)) {
        fadeOut(audio);
      }
    };
  }, [location.pathname]);

  return (
    <BackgroundMusicContext.Provider value={{}}>
      {children}
    </BackgroundMusicContext.Provider>
  );
}
