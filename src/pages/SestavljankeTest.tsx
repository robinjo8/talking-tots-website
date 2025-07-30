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
          <div className="absolute bottom-4 right-4 z-50">
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-background/90 backdrop-blur-sm border-2 shadow-lg hover:bg-background/95 transition-all"
                >
                  <Settings size={28} />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-52 p-3 mr-4 mb-2" 
                side="top" 
                align="end"
                sideOffset={8}
              >
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleNewGame}
                    className="justify-start w-full text-left px-3 py-2"
                  >
                    Nova igra
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="justify-start w-full text-left px-3 py-2"
                  >
                    Nazaj
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleInstructions}
                    className="justify-start w-full text-left px-3 py-2"
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
        <div className="container max-w-6xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Test Sestavljanka</h1>
            <p className="text-muted-foreground">Sestavi sliko Zmajčka Tomija</p>
          </div>

          <ProfessionalJigsaw
            imageUrl={imageUrl}
            gridCols={2}
            gridRows={3}
            onComplete={handlePuzzleComplete}
            className="mb-8"
          />

          {/* Desktop buttons at bottom center - made more prominent */}
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={handleNewGame}
              className="px-6 py-3 text-base font-medium"
            >
              Nova igra
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-6 py-3 text-base font-medium"
            >
              Nazaj
            </Button>
            <Button 
              variant="outline" 
              onClick={handleInstructions}
              className="px-6 py-3 text-base font-medium"
            >
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