import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { MazeGame } from "@/components/games/MazeGame";
import { StarCollectDialog } from "@/components/games/StarCollectDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useGameMode } from "@/contexts/GameModeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LabirintConfig } from "@/data/labirintConfig";
import type { PuzzleImage } from "@/data/puzzleImages";

const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/svetlomodro_ozadje.webp';

interface GenericLabirintGameProps {
  config: LabirintConfig;
  backPath?: string;
  onGameComplete?: () => void;
}

// Extend PuzzleImage with audio for the game
interface GameImage extends PuzzleImage {
  audio?: string;
}

// Add audio to image if not present (derive from filename)
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  // Remove file extension
  let baseName = image.filename.replace('.webp', '').replace('.png', '');
  // Remove trailing '1' suffix (e.g., "cokla1" → "cokla")
  baseName = baseName.replace(/1$/, '');
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

export function GenericLabirintGame({ config, backPath = '/govorne-igre/labirint', onGameComplete }: GenericLabirintGameProps) {
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const gameMode = useGameMode();
  const { recordGameCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();
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
    navigate(backPath);
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

  const handleStarClaimed = async () => {
    const logopedistChildId = gameMode.mode === 'logopedist' 
      ? gameMode.logopedistChildId 
      : undefined;
    recordGameCompletion('maze', config.trackingId, logopedistChildId);
    setShowNewGameButton(true);
    onGameComplete?.();
    // Check for trophy only in user mode
    if (gameMode.mode === 'user') {
      await new Promise(resolve => setTimeout(resolve, 500));
      await checkForNewTrophy();
    }
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
      <button
        onClick={handleNewGame}
        className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
      >
        <RefreshCw className="h-7 w-7 text-white" />
      </button>
    ) : null
  );


  // Mobile landscape view
  if (effectiveFullscreen) {
    if (isPortrait) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-dragon-green to-app-teal p-8 game-container">
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
        className="fixed inset-0 overflow-hidden select-none game-container"
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
        
        <MemoryExitConfirmationDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          onConfirm={handleConfirmExit}
        >
          <span />
        </MemoryExitConfirmationDialog>

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="maze"
        />

        {currentStarImage && (
          <StarCollectDialog
            isOpen={showStarDialog}
            onOpenChange={setShowStarDialog}
            image={currentStarImage}
            starNumber={collectedStars.length + 1}
            onComplete={handleStarDialogComplete}
          />
        )}

        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={starImages[0] || enrichImageWithAudio(config.images[0])}
          allImages={config.images.map(enrichImageWithAudio)}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    );
  }

  // Desktop view
  return (
    <div 
      className="fixed inset-0 overflow-auto select-none game-container"
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
      
      <MemoryExitConfirmationDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={handleConfirmExit}
      >
        <span />
      </MemoryExitConfirmationDialog>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="maze"
      />

      {currentStarImage && (
        <StarCollectDialog
          isOpen={showStarDialog}
          onOpenChange={setShowStarDialog}
          image={currentStarImage}
          starNumber={collectedStars.length + 1}
          onComplete={handleStarDialogComplete}
        />
      )}

      <PuzzleSuccessDialog
        isOpen={showCompletion}
        onOpenChange={setShowCompletion}
        completedImage={starImages[0] || enrichImageWithAudio(config.images[0])}
        allImages={config.images.map(enrichImageWithAudio)}
        onStarClaimed={handleStarClaimed}
      />
    </div>
  );
}
