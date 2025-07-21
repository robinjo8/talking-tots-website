
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
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
    const newGame = gameOptions[randomIndex];
    console.log('Initial game selection:', newGame.audioFile, 'for iframe:', newGame.iframeUrl);
    setSelectedGame(newGame);
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


  // Listen for postMessage events from the iframe and auto-play audio on completion
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received postMessage:', event.data, 'from origin:', event.origin);
      
      // Check if message is from the puzzle iframe
      if (event.origin === 'https://puzzel.org') {
        console.log('Message from puzzle.org:', event.data);
        
        // puzzle.org sends { completed: boolean, activityKey: string }
        if (event.data && event.data.completed === true) {
          console.log('Game completed! Auto-playing audio...');
          setGameCompleted(true);
          
          // Get the current selected game directly at the time of completion
          const currentGame = selectedGame;
          if (currentGame) {
            console.log('Auto-playing audio for completed game:', currentGame.audioFile, 'iframe:', currentGame.iframeUrl);
            
            // Validate the game-to-audio mapping before playing
            const expectedGame = gameOptions.find(g => g.iframeUrl === currentGame.iframeUrl);
            if (expectedGame && expectedGame.audioFile === currentGame.audioFile) {
              console.log('✓ Audio mapping verified. Playing:', currentGame.audioFile);
              playSelectedAudio(currentGame.audioFile);
              recordPuzzleCompletion('povezi_pare_r');
              markButtonAsUsed();
              setShowAudioDialog(true);
            } else {
              console.error('❌ Audio mapping failed! Expected:', expectedGame?.audioFile, 'Got:', currentGame.audioFile);
            }
          } else {
            console.error('❌ No selected game available for auto-play');
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedGame, playSelectedAudio, recordPuzzleCompletion, markButtonAsUsed]); // Include dependencies for proper closure


  const handlePlayAudioInDialog = () => {
    if (selectedGame) {
      console.log('Playing audio in dialog for game:', selectedGame.audioFile, 'iframe:', selectedGame.iframeUrl);
      
      // Validate the game-to-audio mapping before playing
      const expectedGame = gameOptions.find(g => g.iframeUrl === selectedGame.iframeUrl);
      if (expectedGame && expectedGame.audioFile === selectedGame.audioFile) {
        console.log('✓ Audio mapping verified. Playing:', selectedGame.audioFile);
        playSelectedAudio(selectedGame.audioFile);
      } else {
        console.error('❌ Audio mapping failed! Expected:', expectedGame?.audioFile, 'Got:', selectedGame.audioFile);
      }
    } else {
      console.error('No selected game available for dialog audio play');
    }
  };

  const handleNewGame = async () => {
    console.log('Starting new game...');
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
    
    console.log('New game selected:', newGame.audioFile, 'for iframe:', newGame.iframeUrl);
    
    // Atomic update - set all related states together
    setSelectedGame(newGame);
    setGameCompleted(false);
    
    // Small delay to ensure reset message is processed
    setTimeout(() => {
      setIsResetting(false);
      console.log('New game setup complete');
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

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}>
      {!effectiveFullscreen && <Header />}
      
      {/* Mobile edge-to-edge layout */}
      {effectiveFullscreen ? (
        <div className="h-full flex flex-col">
          {/* Puzzle iframe - reduced height for mobile */}
          <div className="flex-1 p-2 overflow-hidden" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <PuzzleIframe 
              ref={iframeRef}
              src={selectedGame.iframeUrl}
              className="w-full h-full"
            />
          </div>

          {/* Button container - single row on mobile */}
          <div className="bg-card border-t p-2 flex-shrink-0">
            <div className="flex gap-2">
              <Button
                onClick={handleNewGame}
                disabled={isResetting}
                variant="outline"
                className="bg-white text-foreground border-border hover:bg-gray-50 flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isResetting ? 'Nalagam...' : 'NOVA IGRA'}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-foreground border-border hover:bg-gray-50 flex-1"
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
          {/* Puzzle iframe - increased height for desktop */}
          <div className="w-full h-[80vh]">
            <PuzzleIframe 
              ref={iframeRef}
              src={selectedGame.iframeUrl}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Button container - desktop layout */}
          <div className="bg-card border p-6 rounded-lg shadow-lg">
            <div className="flex gap-4 justify-center items-center">
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
