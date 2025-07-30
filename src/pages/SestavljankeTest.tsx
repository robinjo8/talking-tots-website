import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { ProfessionalJigsaw } from "@/components/puzzle/ProfessionalJigsaw";
import { AudioPracticeDialog } from "@/components/puzzle/AudioPracticeDialog";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function SestavljankeTest() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const { playAudio } = useAudioPlayback();
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    (points) => {
      toast({
        title: "Odlično!",
        description: `Prejeli ste ${points} točk!`,
      });
    }
  );

  // Enable fullscreen on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      requestFullscreen();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);

  const handlePuzzleComplete = async () => {
    setIsPuzzleCompleted(true);
    setIsAudioDialogOpen(true);
    
    // Record completion in database
    await recordGameCompletion('sestavljanke', 'test');
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sestavljanko!",
    });
    
    // Auto-play audio when dialog opens
    setTimeout(() => {
      playTestAudio();
    }, 500);
  };

  const playTestAudio = async () => {
    setIsAudioLoading(true);
    try {
      // Play a test success sound or word
      const audioUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/zmajcek.mp3";
      playAudio(audioUrl);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const imageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/Zmajcek_6.png";

  const handleNewGame = () => {
    window.location.reload();
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
    setIsMenuOpen(false);
  };

  const handleInstructions = () => {
    // Handle instructions action
    console.log("Navodila clicked");
    setIsMenuOpen(false);
  };

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden w-screen h-screen' : 'min-h-screen bg-background'}`} style={effectiveFullscreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 } : {}}>
      {!effectiveFullscreen && <Header />}
      
      {/* Mobile edge-to-edge layout */}
      {effectiveFullscreen ? (
        <div className="h-full p-4 relative">
          <ProfessionalJigsaw
            imageUrl={imageUrl}
            gridCols={2}
            gridRows={3}
            onComplete={handlePuzzleComplete}
            className="h-full"
          />
          
          {/* Mobile gear icon in bottom right */}
          <div className="absolute bottom-4 right-4">
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-2"
                >
                  <Settings size={24} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" side="top" align="end">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleNewGame}
                    className="justify-start"
                  >
                    Nova igra
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="justify-start"
                  >
                    Nazaj
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleInstructions}
                    className="justify-start"
                  >
                    Navodila
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : (
        /* Desktop layout */
        <div className="container max-w-6xl mx-auto pt-20 md:pt-24 pb-20 px-4 relative">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Test Sestavljanka</h1>
            <p className="text-muted-foreground">Sestavi sliko Zmajčka Tomija</p>
          </div>

          <ProfessionalJigsaw
            imageUrl={imageUrl}
            gridCols={2}
            gridRows={3}
            onComplete={handlePuzzleComplete}
            className="mb-6"
          />

          {/* Desktop buttons at bottom center */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleNewGame}>
              Nova igra
            </Button>
            <Button variant="outline" onClick={handleBack}>
              Nazaj
            </Button>
            <Button variant="outline" onClick={handleInstructions}>
              Navodila
            </Button>
          </div>
        </div>
      )}

      {/* Audio Dialog - appears automatically when puzzle is completed */}
      <AudioPracticeDialog
        isOpen={isAudioDialogOpen}
        onOpenChange={setIsAudioDialogOpen}
        onPlayAudio={playTestAudio}
        onStartRecording={startRecording}
        isAudioLoading={isAudioLoading}
        isRecording={isRecording}
        feedbackMessage={feedbackMessage}
        showPositiveFeedback={showPositiveFeedback}
      />
    </div>
  );
}