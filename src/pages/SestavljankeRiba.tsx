import { useState } from "react";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, Mic, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SestavljankeRiba() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    (points) => {
      toast({
        title: "Odlično!",
        description: `Prejeli ste ${points} točk!`,
      });
    }
  );

  const handlePuzzleComplete = async () => {
    setIsPuzzleCompleted(true);
    await playRibaAudio();
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sestavljanko!",
    });
  };

  const playRibaAudio = async () => {
    setIsAudioLoading(true);
    try {
      // Since the bucket is public, we can access the file directly
      const publicUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke/sestavljanka_riba.mp3";
      
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Sestavljanka - Riba" backPath="/govorne-igre/sestavljanke/r" />
      
      <div className={`flex flex-col gap-4 ${isMobile ? 'px-1 py-2' : 'p-4'}`}>
        {/* Puzzle iframe */}
        <div className={`w-full ${isMobile ? 'h-[75vh]' : 'h-[60vh]'}`}>
          <iframe 
            src='https://puzzel.org/en/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW' 
            width='100%' 
            height='100%' 
            frameBorder='0' 
            allowFullScreen
            className={isMobile ? '' : 'rounded-lg shadow-lg'}
          />
        </div>

        {/* Audio Controls Section */}
        <div className={`bg-card border ${isMobile ? 'p-4 mx-2 rounded-lg shadow-sm' : 'p-6 rounded-lg shadow-lg'}`}>
          <h3 className="text-lg font-semibold mb-4 text-center">Audio vaje</h3>
          
          {!isPuzzleCompleted ? (
            <div className="text-center">
              <Button 
                onClick={handlePuzzleComplete}
                size="lg"
                className="mb-4"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Sestavil sem sestavljanko!
              </Button>
              <p className="text-muted-foreground text-sm">
                Ko sestavite sestavljanko, kliknite gumb za nadaljevanje z vajami.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium mb-3">Poslušajte in ponovite besedo:</h4>
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={playRibaAudio}
                    disabled={isAudioLoading}
                    variant="outline"
                  >
                    {isAudioLoading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    <span className="ml-2">Predvajaj</span>
                  </Button>
                  
                  <Button 
                    onClick={startRecording}
                    disabled={isRecording}
                    variant={isRecording ? "destructive" : "default"}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isRecording ? "Snemam..." : "Posnemi se"}
                  </Button>
                </div>
              </div>

              {feedbackMessage && (
                <div className={`text-center p-3 rounded-md ${
                  showPositiveFeedback ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {feedbackMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}