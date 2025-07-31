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

export default function SestavljankeTest() {
  const [isPuzzleCompleted, setIsPuzzleCompleted] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const { playAudio } = useAudioPlayback();
  
  // Both mobile and desktop get fullscreen for test puzzle (header hidden)
  const effectiveFullscreen = true;
  
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    (points) => {
      toast({
        title: "Odlično!",
        description: `Prejeli ste ${points} točk!`,
      });
    }
  );

  // Enable fullscreen and orientation management
  useEffect(() => {
    if (effectiveFullscreen) {
      const setupFullscreenAndOrientation = async () => {
        try {
          // Request fullscreen
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          
          // Lock orientation to landscape on mobile
          if (isMobile && screen.orientation && (screen.orientation as any).lock) {
            try {
              await (screen.orientation as any).lock('landscape');
            } catch (orientationError) {
              console.log('Orientation lock not supported or denied:', orientationError);
            }
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      
      setupFullscreenAndOrientation();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        if (isMobile && screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock?.();
        }
      };
    }
  }, [effectiveFullscreen, isMobile]);

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

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* CSS-based landscape enforcement for mobile */
          @media screen and (max-width: 768px) and (orientation: portrait) {
            .landscape-enforced {
              transform: rotate(90deg) !important;
              transform-origin: center center !important;
              width: 100vh !important;
              height: 100vw !important;
              position: fixed !important;
              top: calc((100vh - 100vw) / 2) !important;
              left: calc((100vw - 100vh) / 2) !important;
              overflow: hidden !important;
            }
            
            .landscape-content {
              width: 100% !important;
              height: 100% !important;
            }
          }
          
          /* Ensure consistent viewport behavior */
          @media screen and (max-width: 768px) {
            .landscape-enforced {
              -webkit-user-select: none;
              user-select: none;
              touch-action: manipulation;
            }
          }
        `
      }} />
      
      <div 
        className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden w-screen h-screen' : 'min-h-screen bg-background'} landscape-enforced`} 
        style={effectiveFullscreen ? { 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 9999,
          transform: 'none'
        } : {}}
      >
        {!effectiveFullscreen && <Header />}
        
        {/* Fullscreen layout with game and bottom buttons */}
        <div className="h-full flex flex-col landscape-content">
          {/* Game area */}
          <div className="flex-1 p-2 md:p-4">
            <ProfessionalJigsaw
              imageUrl={imageUrl}
              gridCols={2}
              gridRows={3}
              onComplete={handlePuzzleComplete}
              className="h-full"
            />
          </div>
          
          {/* Bottom buttons */}
          <div className="flex justify-center gap-2 md:gap-4 p-2 md:p-4 bg-background">
            <Button 
              variant="default" 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-2"
            >
              🔄 Nova igra
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="text-sm px-3 py-2"
            >
              ← Nazaj
            </Button>
            <Button 
              variant="outline" 
              onClick={() => alert('Povlecite dele sestavljanke na pravo mesto. Ko se del približa svojemu mestu, se bo samodejno prilepil.')}
              className="text-sm px-3 py-2"
            >
              📖 Navodila
            </Button>
          </div>
        </div>

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
    </>
  );
}