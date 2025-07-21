
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { PuzzleIframe } from "@/components/puzzle/PuzzleIframe";
import { usePoveziPareAudio } from "@/hooks/usePoveziPareAudio";
import { useUserProgress } from "@/hooks/useUserProgress";
import { usePuzzleInteraction } from "@/hooks/usePuzzleInteraction";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the 5 iframe games with their corresponding audio files
const gameOptions = [
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfm8Ok0IPIKWbPaPfp",
    audioFile: "r1.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVflmMFjmFQxMk5vtO_",
    audioFile: "r2.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfl697MO2ggEANmloq",
    audioFile: "r3.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfk0nQC-oL1NtmTaH2",
    audioFile: "r4.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfjYDBzRQ76mtp9eKl",
    audioFile: "r5.mp3"
  }
];

export default function PoveziPareR() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { playSelectedAudio, isAudioLoading } = usePoveziPareAudio();
  const { recordPuzzleCompletion } = useUserProgress();
  const { iframeRef, isButtonActive, markButtonAsUsed } = usePuzzleInteraction();
  
  const [selectedGame, setSelectedGame] = useState<typeof gameOptions[0] | null>(null);

  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;

  // Randomly select a game when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gameOptions.length);
    setSelectedGame(gameOptions[randomIndex]);
  }, []);

  // Enable fullscreen on mobile devices only (no orientation lock - allow portrait)
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

  const handleGameComplete = () => {
    if (selectedGame) {
      playSelectedAudio(selectedGame.audioFile);
      recordPuzzleCompletion('povezi_pare_r');
      markButtonAsUsed();
    }
  };

  const handleBackToGames = () => {
    navigate("/govorne-igre");
  };

  if (!selectedGame) {
    return (
      <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}>
        {!effectiveFullscreen && <Header />}
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Nalagam igro...</p>
        </div>
      </div>
    );
  }

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
              src={selectedGame.iframeUrl}
              className="w-full h-full"
            />
          </div>

          {/* Complete puzzle button - positioned below puzzle */}
          <div className="bg-card border-t p-2 flex-shrink-0">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleGameComplete}
                disabled={!isButtonActive || isAudioLoading}
                className={`${
                  isButtonActive 
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                } flex-1 max-w-xs`}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isAudioLoading ? 'Predvajam...' : 'IGRA JE KONČANA'}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-foreground border-border hover:bg-gray-50 px-3"
                onClick={handleBackToGames}
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
          <div className="w-full h-[75vh]">
            <PuzzleIframe 
              ref={iframeRef}
              src={selectedGame.iframeUrl}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Complete puzzle button - always visible */}
          <div className="bg-card border p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <Button
                onClick={handleGameComplete}
                disabled={!isButtonActive || isAudioLoading}
                size="lg"
                className={`${
                  isButtonActive 
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                } mb-4`}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isAudioLoading ? 'Predvajam...' : 'IGRA JE KONČANA'}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-foreground border-border hover:bg-gray-50"
                onClick={handleBackToGames}
              >
                NAZAJ NA IGRE
              </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
