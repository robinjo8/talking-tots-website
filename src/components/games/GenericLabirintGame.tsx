import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { MazeGame } from "@/components/games/MazeGame";
import { StarCollectDialog } from "@/components/games/StarCollectDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LabirintConfig } from "@/data/labirintConfig";
import type { PuzzleImage } from "@/data/puzzleImages";

const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/svetlomodro_ozadje.png';

interface GenericLabirintGameProps {
  config: LabirintConfig;
}

// Extend PuzzleImage with audio for the game
interface GameImage extends PuzzleImage {
  audio?: string;
}

// Add audio to image if not present (derive from filename)
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  const baseName = image.filename.replace('.png', '');
  return {
    ...image,
    audio: `${baseName}.m4a`
  };
};

// Get 4 random unique images from array
const getRandomImages = (images: PuzzleImage[], count: number): GameImage[] => {
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(enrichImageWithAudio);
};

export function GenericLabirintGame({ config }: GenericLabirintGameProps) {
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  
  // Star collection state
  const [collectedStars, setCollectedStars] = useState<number[]>([]);
  const [showStarDialog, setShowStarDialog] = useState(false);
  const [currentStarIndex, setCurrentStarIndex] = useState<number | null>(null);
  const [starImages, setStarImages] = useState<GameImage[]>([]);
  
  // Mobile detection and orientation state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;

  // Initialize 4 random images for stars on mount/new game
  useEffect(() => {
    if (config.images.length >= 4) {
      setStarImages(getRandomImages(config.images, 4));
    }
  }, [config.images, gameKey]);

  // Reliable touch device detection
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Reliable orientation detection
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    
    checkOrientation();
    
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  // Automatic fullscreen and landscape lock
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

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as any).lock('landscape-primary');
            } catch {
              await (screen.orientation as any).lock('landscape');
            }
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };

      requestFullscreen();
      lockLandscape();
        
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  const handleBack = () => {
    setShowExitConfirmation(true);
    setMenuOpen(false);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    navigate("/govorne-igre/labirint");
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCollectedStars([]);
    setCurrentStarIndex(null);
    setShowStarDialog(false);
    setStarImages(getRandomImages(config.images, 4));
    setGameKey(prev => prev + 1);
    setShowCompletion(false);
    setShowNewGameButton(false);
    setMenuOpen(false);
  };

  // Handle when player reaches a star
  const handleStarCollect = useCallback((starIndex: number) => {
    if (collectedStars.includes(starIndex)) return;
    setCurrentStarIndex(starIndex);
    setShowStarDialog(true);
  }, [collectedStars]);

  // Handle when star dialog recording is complete
  const handleStarDialogComplete = useCallback(() => {
    if (currentStarIndex !== null) {
      setCollectedStars(prev => [...prev, currentStarIndex]);
    }
    setShowStarDialog(false);
    setCurrentStarIndex(null);
  }, [currentStarIndex]);

  // Handle reaching the goal (checkered flag)
  const handleComplete = useCallback(() => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  }, []);

  const handleStarClaimed = () => {
    recordGameCompletion('maze', config.trackingId);
    setShowNewGameButton(true);
  };

  // Get the image for current star dialog
  const currentStarImage = currentStarIndex !== null && starImages[currentStarIndex] 
    ? starImages[currentStarIndex] 
    : null;

  // Floating menu component
  const FloatingMenu = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
          <Home className="w-8 h-8 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        side="top"
        sideOffset={8}
        className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
      >
        <button
          onClick={handleBack}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🏠</span>
          <span>Nazaj</span>
        </button>
        <button
          onClick={handleNewGame}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🔄</span>
          <span>Nova igra</span>
        </button>
        <button
          onClick={() => {
            setShowInstructions(true);
            setMenuOpen(false);
          }}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
        >
          <span className="text-2xl">📖</span>
          <span>Navodila</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // New game button
  const NewGameButton = () => (
    showNewGameButton ? (
      <Button
        size="icon"
        onClick={handleNewGame}
        className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"
      >
        <RefreshCw className="w-6 h-6" />
      </Button>
    ) : null
  );

  // Instructions dialog
  const InstructionsDialog = () => (
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">📖 Navodila</DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            Poišči pot skozi labirint in poberi vse 4 zvezdice! Ob vsaki zvezdici ponovi besedo. Ko pobereš vse zvezdice, nadaljuj do cilja (zastavice).
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={() => setShowInstructions(false)} className="bg-app-orange hover:bg-app-orange/90">
            Razumem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Exit confirmation dialog
  const ExitDialog = () => (
    <MemoryExitConfirmationDialog
      open={showExitConfirmation}
      onOpenChange={setShowExitConfirmation}
      onConfirm={handleConfirmExit}
    >
      <span />
    </MemoryExitConfirmationDialog>
  );

  // Shared dialogs
  const Dialogs = () => (
    <>
      <ExitDialog />
      <InstructionsDialog />
      
      {/* Star collection dialog (intermediate) */}
      {currentStarImage && (
        <StarCollectDialog
          isOpen={showStarDialog}
          onOpenChange={setShowStarDialog}
          image={currentStarImage}
          starNumber={collectedStars.length + 1}
          onComplete={handleStarDialogComplete}
        />
      )}
      
      {/* Final completion dialog */}
      <PuzzleSuccessDialog
        isOpen={showCompletion}
        onOpenChange={setShowCompletion}
        completedImage={starImages[0] || enrichImageWithAudio(config.images[0])}
        allImages={config.images.map(enrichImageWithAudio)}
        onStarClaimed={handleStarClaimed}
      />
    </>
  );

  // Mobile landscape view
  if (effectiveFullscreen) {
    if (isPortrait) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-dragon-green to-app-teal p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">Obrni telefon</h2>
            <p className="text-lg opacity-80">Za igro obrni telefon v ležeči položaj</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="fixed inset-0 overflow-hidden select-none"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <MazeGame 
          key={gameKey}
          onComplete={handleComplete}
          onStarCollect={handleStarCollect}
          collectedStars={collectedStars}
          cols={16}
          rows={9}
          alignTop={false}
        />
        
        <FloatingMenu />
        <NewGameButton />
        <Dialogs />
      </div>
    );
  }

  // Desktop view
  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-start pt-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
          LABIRINT - {config.displayLetter}
        </h1>
        
        <MazeGame 
          key={gameKey}
          onComplete={handleComplete}
          onStarCollect={handleStarCollect}
          collectedStars={collectedStars}
          cols={16}
          rows={9}
          alignTop={true}
        />
      </div>

      <FloatingMenu />
      <NewGameButton />
      <Dialogs />
    </div>
  );
}
