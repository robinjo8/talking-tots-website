import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, Mic, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SestavljankeRiba() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
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
    setIsAudioDialogOpen(true);
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sestavljanko!",
    });
    
    // Auto-play audio when dialog opens
    setTimeout(() => {
      playRibaAudio();
    }, 500);
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
      
      {/* Mobile edge-to-edge layout */}
      {isMobile ? (
        <div className="flex flex-col">
          {/* Puzzle iframe - edge to edge on mobile with better spacing */}
          <div className="w-full pt-4" style={{ height: 'calc(100vh - 200px)' }}>
            <iframe 
              src='https://puzzel.org/en/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW' 
              width='100%' 
              height='100%' 
              frameBorder='0' 
              allowFullScreen
              className="block"
            />
          </div>

          {/* Complete puzzle button - positioned below puzzle */}
          <div className="bg-card border-t p-4">
            {!isPuzzleCompleted && (
              <div className="text-center">
                <Button 
                  onClick={handlePuzzleComplete}
                  size="lg"
                  className="mb-2"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Sestavil sem sestavljanko!
                </Button>
                <p className="text-muted-foreground text-sm">
                  Ko sestavite sestavljanko, kliknite gumb za nadaljevanje z vajami.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop layout */
        <div className="flex flex-col gap-4 p-4">
          {/* Puzzle iframe */}
          <div className="w-full h-[60vh]">
            <iframe 
              src='https://puzzel.org/en/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW' 
              width='100%' 
              height='100%' 
              frameBorder='0' 
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Complete puzzle button */}
          {!isPuzzleCompleted && (
            <div className="bg-card border p-6 rounded-lg shadow-lg">
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
            </div>
          )}
        </div>
      )}

      {/* Audio Dialog - appears automatically when puzzle is completed */}
      <Dialog open={isAudioDialogOpen} onOpenChange={setIsAudioDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Audio vaje</DialogTitle>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>
    </div>
  );
}