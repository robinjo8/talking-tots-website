import { useState } from "react";
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

export default function SestavljankeRoza() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { iframeRef, isButtonActive, markButtonAsUsed } = usePuzzleInteraction();
  const { isAudioLoading, playRozaAudio } = usePuzzleAudio();
  
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
    markButtonAsUsed();
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sestavljanko!",
    });
    
    // Auto-play audio when dialog opens
    setTimeout(() => {
      playRozaAudio();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile edge-to-edge layout */}
      {isMobile ? (
        <div className="flex flex-col">
          {/* Puzzle iframe - edge to edge on mobile with better spacing */}
          <div className="w-full pt-4" style={{ height: 'calc(100vh - 200px)' }}>
            <PuzzleIframe 
              ref={iframeRef}
              src='https://puzzel.org/en/jigsaw/embed?p=-OUoF4s1KB3rGu60l0oU'
              className="block"
            />
          </div>

          {/* Complete puzzle button - positioned below puzzle */}
          <div className="bg-card border-t p-4">
            <div className="text-center">
              <PuzzleCompletionButton
                isActive={isButtonActive}
                onComplete={handlePuzzleComplete}
                className="mb-2"
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
      ) : (
        /* Desktop layout */
        <div className="flex flex-col gap-4 p-4">
          {/* Puzzle iframe */}
          <div className="w-full h-[60vh]">
            <PuzzleIframe 
              ref={iframeRef}
              src='https://puzzel.org/en/jigsaw/embed?p=-OUoF4s1KB3rGu60l0oU'
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
        onPlayAudio={playRozaAudio}
        onStartRecording={startRecording}
        isAudioLoading={isAudioLoading}
        isRecording={isRecording}
        feedbackMessage={feedbackMessage}
        showPositiveFeedback={showPositiveFeedback}
      />
    </div>
  );
}