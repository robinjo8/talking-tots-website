
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from "lucide-react";
import { PuzzleIframe } from "@/components/puzzle/PuzzleIframe";
import { AudioPracticeDialog } from "@/components/puzzle/AudioPracticeDialog";
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
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showAudioDialog, setShowAudioDialog] = useState(false);

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

  const handleAutoPlayAudio = () => {
    if (selectedGame) {
      console.log('Auto-playing audio for completed game:', selectedGame.audioFile);
      playSelectedAudio(selectedGame.audioFile);
      recordPuzzleCompletion('povezi_pare_r');
      markButtonAsUsed();
      setShowAudioDialog(true);
    }
  };

  // Listen for postMessage events from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received postMessage:', event.data, 'from origin:', event.origin);
      
      // Check if message is from the puzzle iframe
      if (event.origin === 'https://puzzel.org') {
        console.log('Message from puzzle.org:', event.data);
        
        // puzzle.org sends { completed: boolean, activityKey: string }
        if (event.data && event.data.completed === true) {
          console.log('Game completed! Setting gameCompleted to true');
          setGameCompleted(true);
          // Automatically play audio and show dialog when game completes
          handleAutoPlayAudio();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedGame]);

  const handleGameComplete = () => {
    if (selectedGame && gameCompleted) {
      console.log('Playing audio for completed game:', selectedGame.audioFile);
      playSelectedAudio(selectedGame.audioFile);
      setShowAudioDialog(true);
    }
  };

  const handlePlayAudioInDialog = () => {
    if (selectedGame) {
      playSelectedAudio(selectedGame.audioFile);
    }
  };

  const handleNewGame = async () => {
    setIsResetting(true);
    
    // Reset current game using postMessage
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({ trigger: { type: "reset" } }, "*");
      } catch (error) {
        console.log('PostMessage not supported:', error);
      }
    }
    
    // Randomly select a new game
    const randomIndex = Math.floor(Math.random() * gameOptions.length);
    const newGame = gameOptions[randomIndex];
    
    // Small delay to ensure reset message is processed
    setTimeout(() => {
      console.log('Setting new game:', newGame.audioFile, 'for iframe:', newGame.iframeUrl);
      setSelectedGame(newGame);
      setGameCompleted(false); // Reset completion state for new game
      setIsResetting(false);
    }, 100);
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

  const isWordButtonActive = gameCompleted;

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

          {/* Button container - positioned below puzzle */}
          <div className="bg-card border-t p-2 flex-shrink-0">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleGameComplete}
                disabled={!isWordButtonActive || isAudioLoading}
                className={`${
                  isWordButtonActive 
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                } flex-1 max-w-xs`}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isAudioLoading ? 'Predvajam...' : 'IZGOVORI BESEDE'}
              </Button>
              <Button
                onClick={handleNewGame}
                disabled={isResetting}
                variant="outline"
                className="bg-white text-foreground border-border hover:bg-gray-50 px-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isResetting ? 'Nalagam...' : 'NOVA IGRA'}
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

          {/* Button container - always visible with all buttons in one row */}
          <div className="bg-card border p-6 rounded-lg shadow-lg">
            <div className="flex gap-4 justify-center items-center">
              <Button
                onClick={handleGameComplete}
                disabled={!isWordButtonActive || isAudioLoading}
                size="lg"
                className={`${
                  isWordButtonActive 
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isAudioLoading ? 'Predvajam...' : 'IZGOVORI BESEDE'}
              </Button>
              <Button
                onClick={handleNewGame}
                disabled={isResetting}
                size="lg"
                variant="outline"
                className="bg-white text-foreground border-border hover:bg-gray-50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {isResetting ? 'Nalagam...' : 'NOVA IGRA'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white text-foreground border-border hover:bg-gray-50"
                onClick={handleBackToGames}
              >
                NAZAJ NA IGRE
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio Practice Dialog */}
      <AudioPracticeDialog
        isOpen={showAudioDialog}
        onOpenChange={setShowAudioDialog}
        onPlayAudio={handlePlayAudioInDialog}
        onStartRecording={() => {}} // TODO: Implement recording functionality
        isAudioLoading={isAudioLoading}
        isRecording={false}
        showPositiveFeedback={false}
      />
    </div>
  );
}
