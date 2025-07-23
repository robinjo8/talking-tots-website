import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { useToast } from "@/hooks/use-toast";
import { usePuzzleInteraction } from "@/hooks/usePuzzleInteraction";
import { usePuzzleAudio } from "@/hooks/usePuzzleAudio";
import { PuzzleIframe } from "@/components/puzzle/PuzzleIframe";
import { PuzzleCompletionButton } from "@/components/puzzle/PuzzleCompletionButton";
import { AudioPracticeDialog } from "@/components/puzzle/AudioPracticeDialog";
import { Button } from "@/components/ui/button";

export default function SestavljankeRiba() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const { iframeRef, isButtonActive, markButtonAsUsed } = usePuzzleInteraction();
  const { isAudioLoading, playRibaAudio } = usePuzzleAudio();
  
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    (points) => {
      toast({
        title: "Odlično!",
        description: `Prejeli ste ${points} točk!`,
      });
    }
  );

  // Enable fullscreen and landscape orientation on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          // Lock to landscape orientation (with proper type casting)
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape');
          }
          
          // Request fullscreen with aggressive system UI hiding
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          
          // Hide address bar on mobile browsers
          window.scrollTo(0, 1);
          
          // Additional viewport meta manipulation for full immersion
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui, viewport-fit=cover');
          }
        } catch (error) {
          console.log('Fullscreen or orientation lock not supported:', error);
        }
      };
      requestFullscreen();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        // Unlock orientation
        if (screen.orientation && 'unlock' in screen.orientation) {
          (screen.orientation as any).unlock();
        }
        // Restore viewport
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      };
    }
  }, [effectiveFullscreen]);

  const handlePuzzleComplete = async () => {
    setIsPuzzleCompleted(true);
    setIsAudioDialogOpen(true);
    markButtonAsUsed();
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sestavljanko!",
    });
    
    // Auto-play audio when dialog opens
    setTimeout(() => {
      playRibaAudio();
    }, 500);
  };

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden w-screen h-screen' : 'min-h-screen bg-background'}`} style={effectiveFullscreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 } : {}}>
      {!effectiveFullscreen && <Header />}
      
      {/* Mobile edge-to-edge layout */}
      {effectiveFullscreen ? (
        <div className="h-full">
          {/* Puzzle iframe - fullscreen on mobile with no buttons */}
          <div className="h-full p-2">
            <PuzzleIframe 
              ref={iframeRef}
              src='https://puzzel.org/sl/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW'
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        /* Desktop layout */
        <div className="flex flex-col gap-4 p-4 pt-20">
          {/* Puzzle iframe */}
          <div className="w-full h-[60vh]">
            <PuzzleIframe 
              ref={iframeRef}
              src='https://puzzel.org/sl/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW'
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Complete puzzle button - always visible */}
          <div className="bg-card border p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <PuzzleCompletionButton
                isActive={isButtonActive}
                onComplete={handlePuzzleComplete}
                className="mb-4"
               />
               <Button 
                 variant="outline" 
                 className="bg-white text-foreground border-border hover:bg-gray-50"
                 onClick={() => window.history.back()}
               >
                 Nazaj na sestavljanke
               </Button>
             </div>
          </div>
        </div>
      )}

      {/* Audio Dialog - appears automatically when puzzle is completed */}
      <AudioPracticeDialog
        isOpen={isAudioDialogOpen}
        onOpenChange={setIsAudioDialogOpen}
        onPlayAudio={playRibaAudio}
        onStartRecording={startRecording}
        isAudioLoading={isAudioLoading}
        isRecording={isRecording}
        feedbackMessage={feedbackMessage}
        showPositiveFeedback={showPositiveFeedback}
      />
    </div>
  );
}