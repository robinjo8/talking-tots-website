import { useState } from "react";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, Mic, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SestavljankeRiba() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { playAudio } = useAudioPlayback();
  const { toast } = useToast();
  
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
      // First check if the file exists in the bucket
      const { data: files } = await supabase.storage
        .from('sestavljanke')
        .list('', { search: 'sestavljanka_riba.mp3' });

      if (!files || files.length === 0) {
        throw new Error('Audio file not found in storage');
      }

      const { data } = await supabase.storage
        .from('sestavljanke')
        .createSignedUrl('sestavljanka_riba.mp3', 3600);
      
      if (data?.signedUrl) {
        playAudio(data.signedUrl);
        toast({
          title: "Predvajam",
          description: "Poslušajte besedo 'riba'",
        });
      } else {
        throw new Error('Could not get audio file');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Napaka",
        description: "Zvočna datoteka 'sestavljanka_riba.mp3' ni najdena. Prosimo naložite jo v Supabase storage bucket 'sestavljanke'.",
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
      
      <div className="flex flex-col gap-4 p-4">
        {/* Puzzle iframe */}
        <div className="w-full h-[60vh]">
          <iframe 
            src='https://puzzel.org/en/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW' 
            width='100%' 
            height='100%' 
            frameBorder='0' 
            allowFullScreen
            title="Riba Sestavljanka"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Audio Controls Section */}
        <div className="bg-card p-6 rounded-lg shadow-lg border">
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