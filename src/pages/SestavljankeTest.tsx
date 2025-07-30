import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import { useEnhancedMobile } from "@/hooks/useEnhancedMobile";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { ProfessionalJigsaw } from "@/components/puzzle/ProfessionalJigsaw";
import { AudioPracticeDialog } from "@/components/puzzle/AudioPracticeDialog";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { Button } from "@/components/ui/button";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";

export default function SestavljankeTest() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Force puzzle reset
  const [backPressCount, setBackPressCount] = useState(() => {
    // Get stored count from sessionStorage to persist across navigation attempts
    const stored = sessionStorage.getItem('backPressCount');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isExiting, setIsExiting] = useState(false);
  const { toast } = useToast();
  const { 
    isMobile, 
    isLandscape, 
    isFullscreen, 
    requestFullscreen, 
    exitFullscreen,
    lockOrientation,
    unlockOrientation
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
    
    // Cleanup function to restore normal document state
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      // Force cleanup on component unmount
      const forceCleanup = async () => {
        try {
          // Reset document body styles
          document.body.style.position = '';
          document.body.style.overflow = '';
          document.body.style.height = '';
          document.body.style.width = '';
          document.documentElement.style.overflow = '';
          
          // Unlock orientation and exit fullscreen
          await unlockOrientation();
          await exitFullscreen();
        } catch (error) {
          console.warn('Cleanup error on unmount:', error);
        }
      };
      
      forceCleanup();
    };
  }, [isMobile, isLandscape, isFullscreen, requestFullscreen, lockOrientation, unlockOrientation, exitFullscreen]);

  // Proper navigation exit function
  const exitGame = useCallback(async () => {
    if (isExiting) return; // Prevent multiple simultaneous exits
    
    setIsExiting(true);
    sessionStorage.removeItem('backPressCount'); // Clean up storage
    
    try {
      await unlockOrientation();
      await exitFullscreen();
      
      // Navigate with proper cleanup
      setTimeout(() => {
        navigate('/govorne-igre/sestavljanke', { replace: true });
      }, 300);
    } catch (error) {
      console.warn('Error exiting game:', error);
      navigate('/govorne-igre/sestavljanke', { replace: true });
    }
  }, [unlockOrientation, exitFullscreen, navigate, isExiting]);

  // Enhanced back button handling with proper state persistence
  useEffect(() => {
    if (!isMobile) return;

    let backPressTimer: NodeJS.Timeout;
    let navigationBlocked = false;

    const handleVisibilityChange = () => {
      // Reset fullscreen when page becomes visible again (handles Android back button edge cases)
      if (!document.hidden && isMobile && !isFullscreen) {
        requestFullscreen();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // This helps with some browsers that fire beforeunload on back button
      if (backPressCount === 0) {
        event.preventDefault();
        event.returnValue = '';
        handleBackPress();
        return '';
      }
    };

    const handleBackPress = () => {
      const currentCount = parseInt(sessionStorage.getItem('backPressCount') || '0', 10);
      
      if (currentCount === 0) {
        // First press - show warning and start timer
        const newCount = 1;
        sessionStorage.setItem('backPressCount', newCount.toString());
        setBackPressCount(newCount);
        
        toast({
          title: "Pritisnite ponovno za izhod",
          description: "Drugo pritiskanje vas bo vrnilo nazaj",
          duration: 2000,
          action: (
            <ToastAction
              altText="Ostani v igri"
              onClick={() => {
                sessionStorage.setItem('backPressCount', '0');
                setBackPressCount(0);
                clearTimeout(backPressTimer);
              }}
            >
              Ostani
            </ToastAction>
          )
        });
        
        // Reset counter after 2 seconds
        backPressTimer = setTimeout(() => {
          sessionStorage.setItem('backPressCount', '0');
          setBackPressCount(0);
        }, 2000);
        
        // Add another history entry to "catch" the next back press
        window.history.pushState(null, '', window.location.href);
        
      } else {
        // Second press - exit
        clearTimeout(backPressTimer);
        exitGame();
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      if (!navigationBlocked) {
        navigationBlocked = true;
        handleBackPress();
        
        // Reset block after a short delay
        setTimeout(() => {
          navigationBlocked = false;
        }, 100);
      }
    };

    // Set up initial history entry
    window.history.pushState(null, '', window.location.href);
    
    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (backPressTimer) {
        clearTimeout(backPressTimer);
      }
    };
  }, [isMobile, backPressCount, toast, exitGame, requestFullscreen, isFullscreen]);

  // Use React Router's beforeunload hook as additional protection
  useBeforeUnload(
    useCallback(() => {
      const currentCount = parseInt(sessionStorage.getItem('backPressCount') || '0', 10);
      return currentCount === 0;
    }, [])
  );

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

  const handleBack = async () => {
    console.log('handleBack clicked - starting comprehensive exit process');
    setIsExiting(true);
    
    // Comprehensive cleanup function
    const performCleanup = async () => {
      try {
        // 1. Reset document body styles immediately
        console.log('Resetting document styles...');
        document.body.style.position = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.zIndex = '';
        document.documentElement.style.overflow = '';
        
        // 2. Force scroll restoration
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // 3. Unlock orientation with multiple methods for better compatibility
        console.log('Unlocking orientation...');
        if (screen.orientation && screen.orientation.unlock) {
          await screen.orientation.unlock();
        }
        await unlockOrientation();
        console.log('Orientation unlocked');
        
        // 4. Exit fullscreen
        console.log('Exiting fullscreen...');
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        await exitFullscreen();
        console.log('Fullscreen exited');
        
        // 5. Clear session storage
        sessionStorage.removeItem('backPressCount');
        
        console.log('Cleanup completed successfully');
        return true;
      } catch (error) {
        console.warn('Error during cleanup:', error);
        return false;
      }
    };
    
    // Perform cleanup and navigate with increased delay
    const cleanupSuccess = await performCleanup();
    
    // Navigate with longer delay to ensure all changes take effect
    setTimeout(() => {
      console.log('Navigating to /govorne-igre/sestavljanke');
      navigate('/govorne-igre/sestavljanke', { replace: true });
      
      // Force one more cleanup after navigation as backup
      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
      }, 100);
    }, cleanupSuccess ? 200 : 50);
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