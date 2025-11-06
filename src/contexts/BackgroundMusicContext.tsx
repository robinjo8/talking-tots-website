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
  const location = useLocation();

  useEffect(() => {
    // Initialize audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Set to 30% volume for background music
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentPath = location.pathname;
    const shouldPlay = MUSIC_ROUTES.includes(currentPath);

    if (shouldPlay) {
      // Play music if on a valid route
      audio.play().catch(error => {
        console.log('Background music autoplay prevented:', error);
      });
    } else {
      // Pause music on other routes
      audio.pause();
    }

    // Cleanup on unmount
    return () => {
      if (audio && !MUSIC_ROUTES.includes(location.pathname)) {
        audio.pause();
      }
    };
  }, [location.pathname]);

  return (
    <BackgroundMusicContext.Provider value={{}}>
      {children}
    </BackgroundMusicContext.Provider>
  );
}
