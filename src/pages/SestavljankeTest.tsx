import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { useEnhancedMobile } from "@/hooks/useEnhancedMobile";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { ProfessionalJigsaw } from "@/components/puzzle/ProfessionalJigsaw";
import { AudioPracticeDialog } from "@/components/puzzle/AudioPracticeDialog";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";

export default function SestavljankeTest() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Force puzzle reset
  const { toast } = useToast();
  const { 
    isMobile, 
    isLandscape, 
    isFullscreen, 
    requestFullscreen, 
    lockOrientation 
  } = useEnhancedMobile();
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const { playAudio } = useAudioPlayback();
  const puzzleRef = useRef<{ resetPuzzle: () => void }>(null);
  
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    (points) => {
      toast({
        title: "Odlično!",
        description: `Prejeli ste ${points} točk!`,
      });
    }
  );

  // Enhanced fullscreen and orientation handling
  useEffect(() => {
    let fullscreenAttempted = false;
    
    const setupMobileExperience = async () => {
      if (isMobile && !fullscreenAttempted) {
        fullscreenAttempted = true;
        
        // Always request fullscreen immediately on mobile
        const fullscreenSuccess = await requestFullscreen();
        
        if (fullscreenSuccess) {
          // Try to lock landscape orientation
          setTimeout(() => {
            lockOrientation('landscape');
          }, 100);
        }
      }
    };

    setupMobileExperience();

    // Handle orientation changes while maintaining fullscreen
    const handleOrientationChange = async () => {
      if (isMobile && isLandscape && !isFullscreen) {
        // Re-request fullscreen if we lost it during orientation change
        await requestFullscreen();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, isLandscape, isFullscreen, requestFullscreen, lockOrientation]);

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
    // Reset puzzle state without reloading page to maintain fullscreen
    setIsPuzzleCompleted(false);
    setIsAudioDialogOpen(false);
    
    // Force puzzle component to re-mount with new key
    setGameKey(prev => prev + 1);
    
    // Also call direct reset if available
    if (puzzleRef.current?.resetPuzzle) {
      puzzleRef.current.resetPuzzle();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleInstructions = () => {
    // Handle instructions action
    console.log("Navodila clicked");
  };

  return (
    <div 
      className={`${isMobile ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}
      style={isMobile ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'black', // Ensure black background for fullscreen
      } : {}}
    >
      {!isMobile && <Header />}
      
      {/* Show portrait message on mobile when not in landscape, but WITHIN fullscreen container */}
      {isMobile && !isLandscape ? (
        <div className="h-full flex items-center justify-center p-8 bg-background">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <RotateCcw className="w-16 h-16 mx-auto text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Za začetek igre obrnite telefon
            </h2>
            <p className="text-lg text-muted-foreground">
              Igra se izvaja v ležečem načinu
            </p>
          </div>
        </div>
      ) : (
        /* Game layout - Unified for both mobile and desktop */
        <div className="h-full flex flex-col relative">
          <div className="flex-1 p-4">
            <ProfessionalJigsaw
              key={gameKey} // Force re-mount on new game
              ref={puzzleRef}
              imageUrl={imageUrl}
              gridCols={2}
              gridRows={3}
              onComplete={handlePuzzleComplete}
              className="h-full"
            />
          </div>
          
          {/* Unified Controls: Always bottom center for consistency */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleNewGame}
                className="px-6 py-3 text-base font-medium bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background/95 border-2"
              >
                Nova igra
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-6 py-3 text-base font-medium bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background/95 border-2"
              >
                Nazaj
              </Button>
              <Button 
                variant="outline" 
                onClick={handleInstructions}
                className="px-6 py-3 text-base font-medium bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background/95 border-2"
              >
                Navodila
              </Button>
            </div>
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