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
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}>
      {!effectiveFullscreen && <Header />}
      
      {/* Mobile edge-to-edge layout */}
      {effectiveFullscreen ? (
        <div className="h-full flex flex-col">
          {/* Puzzle iframe - fullscreen on mobile */}
          <div className="flex-1 p-2 overflow-hidden">
            <PuzzleIframe 
              ref={iframeRef}
              src='https://puzzel.org/sl/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW'
              className="w-full h-full"
            />
          </div>

          {/* Complete puzzle button - positioned below puzzle */}
          <div className="bg-card border-t p-2 flex-shrink-0">
            <div className="flex gap-2 justify-center">
              <PuzzleCompletionButton
                isActive={isButtonActive}
                onComplete={handlePuzzleComplete}
                className="flex-1 max-w-xs"
               />
               <Button 
                 variant="outline" 
                 className="bg-white text-foreground border-border hover:bg-gray-50 px-3"
                 onClick={() => window.history.back()}
               >
                 Nazaj
               </Button>
            </div>
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