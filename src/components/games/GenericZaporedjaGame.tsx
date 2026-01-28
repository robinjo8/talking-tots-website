import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { SequenceGameBase, SequenceGameConfig } from "@/components/exercises/SequenceGameBase";
import { SequenceGame56Base } from "@/components/exercises/SequenceGame56Base";
import { SequenceGameC } from "@/components/exercises/SequenceGameC";
import { SequenceGameK } from "@/components/exercises/SequenceGameK";
import { SequenceGameL } from "@/components/exercises/SequenceGameL";
import { SequenceGameR } from "@/components/exercises/SequenceGameR";
import { SequenceGameS } from "@/components/exercises/SequenceGameS";
import { SequenceGameZ } from "@/components/exercises/SequenceGameZ";
import { SequenceGameČ } from "@/components/exercises/SequenceGameČ";
import { SequenceGameŠ } from "@/components/exercises/SequenceGameŠ";
import { SequenceGameŽ } from "@/components/exercises/SequenceGameŽ";
import type { ZaporedjaGameConfig } from "@/data/zaporedjaConfig";

// Game configs for different age groups
const config78: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

const config910: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 7,
  helpAttempts: 1,
  helpDuration: 5
};

interface GenericZaporedjaGameProps {
  config: ZaporedjaGameConfig;
}

export function GenericZaporedjaGame({ config }: GenericZaporedjaGameProps) {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();
  const gameCompletedRef = useRef(false);

  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [playedImages, setPlayedImages] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  
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

  const handleGameComplete = (images: any[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      const transformedImages = images.map(img => ({
        url: img.image_url || '',
        word: img.word || '',
        audio_url: img.audio_url || '',
        filename: img.word?.toLowerCase() || ''
      }));
      setPlayedImages(transformedImages);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setGameKey(prev => prev + 1);
    setShowNewGameConfirmation(false);
    setShowNewGameButton(false);
  };

  const handleStartNewGameDirect = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setGameKey(prev => prev + 1);
    setShowNewGameButton(false);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorne-igre/zaporedja');
  };

  const handleStarClaimed = async () => {
    recordGameCompletion('memory', config.trackingId);
    setShowCompletion(false);
    setShowNewGameButton(true);
    // Check for trophy after claiming star
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  };

  // Render the appropriate game component based on config
  const renderGame = (isLandscape: boolean) => {
    const commonProps = {
      key: gameKey,
      onGameComplete: handleGameComplete,
      isLandscape
    };

    // For 3-4 age group, use the original SequenceGame components
    if (config.gameType === '34') {
      switch (config.urlKey) {
        case 'c': return <SequenceGameC {...commonProps} />;
        case 'ch': return <SequenceGameČ {...commonProps} />;
        case 'k': return <SequenceGameK {...commonProps} />;
        case 'l': return <SequenceGameL {...commonProps} />;
        case 'r': return <SequenceGameR {...commonProps} />;
        case 's': return <SequenceGameS {...commonProps} />;
        case 'sh': return <SequenceGameŠ {...commonProps} />;
        case 'z': return <SequenceGameZ {...commonProps} />;
        case 'zh': return <SequenceGameŽ {...commonProps} />;
        default: return <SequenceGameC {...commonProps} />;
      }
    }

    // For 5-6 age group, use SequenceGame56Base
    if (config.gameType === '56') {
      return (
        <SequenceGame56Base
          key={gameKey}
          onGameComplete={handleGameComplete}
          isLandscape={isLandscape}
          tableName={config.tableName}
          queryKey={config.queryKey}
        />
      );
    }

    // For 7-8 and 9-10 age groups, use SequenceGameBase with appropriate config
    const gameConfig = config.gameType === '910' ? config910 : config78;
    return (
      <SequenceGameBase
        key={gameKey}
        onGameComplete={handleGameComplete}
        isLandscape={isLandscape}
        tableName={config.tableName}
        queryKey={config.queryKey}
        config={gameConfig}
      />
    );
  };

  const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp';

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        
        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden h-full w-full p-2">
          {!isPortrait ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {renderGame(true)}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">
                Za igranje igre Zaporedja prosim obrni telefon v ležeči položaj.
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
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
                onClick={handleInstructions}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          {showNewGameButton && (
            <button
              onClick={handleStartNewGameDirect}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <RefreshCw className="h-7 w-7 text-white" />
            </button>
          )}
        </div>

        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={playedImages}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE"
          isMobileLandscape={true}
        />

        <MemoryExitConfirmationDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          onConfirm={handleConfirmExit}
        >
          <></>
        </MemoryExitConfirmationDialog>

        <MemoryExitConfirmationDialog
          open={showNewGameConfirmation}
          onOpenChange={setShowNewGameConfirmation}
          onConfirm={handleConfirmNewGame}
        >
          <></>
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  // Desktop version
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
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          ZAPOREDJA - {config.letter}
        </h1>
        
        {renderGame(false)}
      </div>

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
              <span className="text-xl">🔄</span>
              <span className="font-medium">Nova igra</span>
            </button>
            <button
              onClick={handleInstructions}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-xl">📖</span>
              <span className="font-medium">Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {showNewGameButton && (
          <button
            onClick={handleStartNewGameDirect}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <RefreshCw className="h-7 w-7 text-white" />
          </button>
        )}
      </div>
      
      <MatchingInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      <MatchingCompletionDialog
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        images={playedImages}
        onStarClaimed={handleStarClaimed}
        instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE"
        isMobileLandscape={false}
      />

      <MemoryExitConfirmationDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={handleConfirmExit}
      >
        <></>
      </MemoryExitConfirmationDialog>

      <MemoryExitConfirmationDialog
        open={showNewGameConfirmation}
        onOpenChange={setShowNewGameConfirmation}
        onConfirm={handleConfirmNewGame}
      >
        <></>
      </MemoryExitConfirmationDialog>
    </div>
  );
}
