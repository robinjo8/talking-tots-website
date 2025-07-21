
import { useState } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useToast } from "@/hooks/use-toast";

export function usePoveziPareAudio() {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();

  const playSelectedAudio = async (audioFilename: string) => {
    setIsAudioLoading(true);
    try {
      const publicUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/povezi-pare-r/${audioFilename}`;
      
      playAudio(publicUrl);
      toast({
        title: "Predvajam",
        description: "Poslušajte besedo",
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Napaka",
        description: "Ni mogoče predvajati zvoka.",
        variant: "destructive",
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  return {
    isAudioLoading,
    playSelectedAudio
  };
}
