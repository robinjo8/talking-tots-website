
import { useState } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

export function usePoveziPareAudio() {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { playAudio } = useAudioPlayback();

  const playSelectedAudio = async (audioFilename: string) => {
    console.log('Playing audio file:', audioFilename);
    setIsAudioLoading(true);
    
    try {
      const publicUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/povezi-pare-r/${audioFilename}`;
      console.log('Audio URL:', publicUrl);
      
      playAudio(publicUrl);
      
      // Removed the toast message as requested
      console.log('Audio playback initiated successfully');
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return {
    isAudioLoading,
    playSelectedAudio
  };
}
