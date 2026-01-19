import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RotateCcw, BookOpen } from "lucide-react";
import { MazeGame } from "@/components/games/MazeGame";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
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

const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/svetlomodro_ozadje.png';

interface GenericLabirintGameProps {
  config: LabirintConfig;
}

export function GenericLabirintGame({ config }: GenericLabirintGameProps) {
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  
  // Mobile detection and orientation state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;

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
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    navigate("/govorne-igre/labirint");
  };

  const handleNewGame = () => {
    setGameKey(prev => prev + 1);
    setShowCompletion(false);
    setMenuOpen(false);
  };

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleClaimStar = () => {
    setShowCompletion(false);
    // Optionally navigate back or start new game
    handleNewGame();
  };

  // Floating menu component
  const FloatingMenu = () => (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          align="start"
          side="top"
          sideOffset={8}
        >
          <button
            onClick={handleBack}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Nazaj</span>
          </button>
          <button
            onClick={handleNewGame}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Nova igra</span>
          </button>
          <button
            onClick={() => {
              setShowInstructions(true);
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Instructions dialog
  const InstructionsDialog = () => (
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">📖 Navodila</DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            Poišči pot skozi labirint do zvezdice! Uporabi puščice na tipkovnici ali povleci s prstom.
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

  // Completion dialog
  const CompletionDialog = () => (
    <Dialog open={showCompletion} onOpenChange={setShowCompletion}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <span>🎊</span> Čestitke!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            Uspešno si prešel labirint s črko {config.displayLetter}!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-4">
          <img 
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zvezdica_3d.png"
            alt="Zvezdica"
            className="w-24 h-24 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Button 
            onClick={handleClaimStar} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-full"
          >
            Vzemi zvezdico
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

  // Mobile landscape view
  if (effectiveFullscreen) {
    // Portrait mode - show rotate message
    if (isPortrait) {
      return (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-dragon-green to-app-teal p-8"
        >
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">Obrni telefon</h2>
            <p className="text-lg opacity-80">Za igro obrni telefon v ležeči položaj</p>
          </div>
        </div>
      );
    }

    // Landscape mode - full game
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
          alignTop={false}
        />
        
        <FloatingMenu />
        <InstructionsDialog />
        <CompletionDialog />
        <ExitDialog />
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
          alignTop={true}
        />
      </div>

      <FloatingMenu />
      <InstructionsDialog />
      <CompletionDialog />
      <ExitDialog />
    </div>
  );
}
