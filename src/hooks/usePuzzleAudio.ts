import { useState } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useToast } from "@/hooks/use-toast";

export function usePuzzleAudio() {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();

  const playRibaAudio = async () => {
    setIsAudioLoading(true);
    try {
      const publicUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/riba.m4a";
      
      playAudio(publicUrl);
      toast({
        title: "Predvajam",
        description: "Poslušajte besedo 'riba'",
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

  const playRokaAudio = async () => {
    setIsAudioLoading(true);
    try {
      const publicUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/roka.m4a";
      
      playAudio(publicUrl);
      toast({
        title: "Predvajam",
        description: "Poslušajte besedo 'roka'",
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

  const playRozaAudio = async () => {
    setIsAudioLoading(true);
    try {
      const publicUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/roza.m4a";
      
      playAudio(publicUrl);
      toast({
        title: "Predvajam",
        description: "Poslušajte besedo 'roža'",
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
    playRibaAudio,
    playRokaAudio,
    playRozaAudio
  };
}