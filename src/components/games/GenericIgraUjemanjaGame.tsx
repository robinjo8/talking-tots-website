import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MatchingGame } from "@/components/matching/MatchingGame";
import { ThreeColumnGame } from "@/components/matching/ThreeColumnGame";
import { FourColumnGame } from "@/components/matching/FourColumnGame";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { FourColumnInstructionsModal } from "@/components/matching/FourColumnInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { getLetterData, getImagesForAgeGroup, type MatchingGameImage } from "@/data/matchingGameData";
import { getRandomThreeColumnItems, getRandomFourColumnItems, type ThreeColumnMatchingItem, type FourColumnMatchingItem } from "@/data/threeColumnMatchingData";
import type { IgraUjemanjaGameConfig } from "@/data/igraUjemanjaConfig";
import { digraphToLetter } from "@/data/igraUjemanjaConfig";

interface GenericIgraUjemanjaGameProps {
  config: IgraUjemanjaGameConfig;
}

const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";

export function GenericIgraUjemanjaGame({ config }: GenericIgraUjemanjaGameProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  
  // For MatchingGame (3-4 age group)
  const [playedImages, setPlayedImages] = useState<MatchingGameImage[]>([]);
  
  // For ThreeColumn and FourColumn games
  const [threeColumnItems, setThreeColumnItems] = useState<ThreeColumnMatchingItem[]>([]);
  const [fourColumnItems, setFourColumnItems] = useState<FourColumnMatchingItem[]>([]);

  // Touch device and orientation detection (same pattern as Zaporedja)
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const effectiveFullscreen = isTouchDevice;

  // Touch device detection
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Orientation detection with screen.orientation API
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    
    checkOrientation();
    
    const handleOrientationChange = () => setTimeout(checkOrientation, 100);
    
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

  // Fullscreen and orientation lock
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch {}
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
        } catch {}
      };
      
      requestFullscreen();
      lockLandscape();
      
      return () => {
        if (document.fullscreenElement) document.exitFullscreen?.();
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch {}
      };
    }
  }, [effectiveFullscreen]);

  // Get the actual letter from urlKey for data lookup
  const actualLetter = digraphToLetter[config.urlKey] || config.letter;

  // Initialize game items based on game type
  const gameImages = useMemo(() => {
    if (config.gameType === 'matching') {
      const letterData = getLetterData(actualLetter);
      return letterData ? getImagesForAgeGroup(letterData.images, config.requiredAgeGroup) : [];
    }
    return [];
  }, [gameKey, actualLetter, config.gameType, config.requiredAgeGroup]);

  // Initialize three/four column items
  useEffect(() => {
    if (config.gameType === 'threeColumn') {
      const items = getRandomThreeColumnItems(config.numItems, config.urlKey);
      setThreeColumnItems(items);
    } else if (config.gameType === 'fourColumn') {
      const items = getRandomFourColumnItems(config.numItems, config.urlKey);
      setFourColumnItems(items);
    }
  }, [gameKey, config.gameType, config.numItems, config.urlKey]);

  // Separate handlers for each game type
  const handleMatchingComplete = (score: number, images: MatchingGameImage[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setPlayedImages(images);
      setIsGameCompleted(true);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleThreeColumnComplete = (score: number, items: ThreeColumnMatchingItem[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setThreeColumnItems(items);
      setIsGameCompleted(true);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleFourColumnComplete = (score: number, items: FourColumnMatchingItem[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setFourColumnItems(items);
      setIsGameCompleted(true);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setIsGameCompleted(false);
    setMenuOpen(false);
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorne-igre/igra-ujemanja');
  };

  const handleStarClaimed = () => {
    recordGameCompletion('matching', config.trackingId);
  };

  // Get completion images based on game type
  const getCompletionImages = () => {
    if (config.gameType === 'matching') {
      return playedImages.length > 0 ? playedImages : gameImages;
    } else if (config.gameType === 'threeColumn') {
      return threeColumnItems.map(item => ({
        word: item.word,
        url: `${SUPABASE_STORAGE_URL}/${item.originalImage}`,
        filename: item.originalImage
      }));
    } else {
      return fourColumnItems.map(item => ({
        word: item.word,
        url: `${SUPABASE_STORAGE_URL}/${item.originalImage}`,
        filename: item.originalImage
      }));
    }
  };

  // Render appropriate game component
  const renderGame = (isLandscape: boolean) => {
    switch (config.gameType) {
      case 'matching':
        return (
          <MatchingGame
            key={gameKey}
            images={gameImages}
            numColumns={config.numColumns}
            onGameComplete={handleMatchingComplete}
            isLandscape={isLandscape}
          />
        );
      case 'threeColumn':
        return (
          <ThreeColumnGame
            key={gameKey}
            items={threeColumnItems}
            onGameComplete={handleThreeColumnComplete}
            isLandscape={isLandscape}
          />
        );
      case 'fourColumn':
        return (
          <FourColumnGame
            key={gameKey}
            items={fourColumnItems}
            onGameComplete={handleFourColumnComplete}
            isLandscape={isLandscape}
          />
        );
    }
  };

  // Render appropriate instructions modal
  const renderInstructionsModal = () => {
    switch (config.gameType) {
      case 'matching':
      case 'threeColumn':
        return (
          <MatchingInstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
          />
        );
      case 'fourColumn':
        return (
          <FourColumnInstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
          />
        );
    }
  };

  const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/oranzno_ozadje.png';

  // MOBILE VERSION (same structure as Zaporedja)
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
                Za igranje igre prosim obrni telefon v ležeči položaj.
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
                onClick={() => { setMenuOpen(false); setShowInstructions(true); }} 
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isGameCompleted && (
            <Button
              onClick={handleNewGame}
              className="rounded-full w-16 h-16 bg-sky-400 hover:bg-sky-500 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <RefreshCw className="h-7 w-7 text-white" />
            </Button>
          )}
        </div>
        
        {renderInstructionsModal()}
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={getCompletionImages()}
          onStarClaimed={handleStarClaimed}
          isMobileLandscape={true}
        />

        <MemoryExitConfirmationDialog
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={handleConfirmExit}
        >
          <></>
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  // DESKTOP VERSION
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
          IGRA UJEMANJA - {config.letter}
        </h1>
        {renderGame(false)}
      </div>
      
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
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
              onClick={() => { setMenuOpen(false); setShowInstructions(true); }} 
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-xl">📖</span>
              <span className="font-medium">Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isGameCompleted && (
          <Button
            onClick={handleNewGame}
            className="rounded-full w-16 h-16 bg-sky-400 hover:bg-sky-500 shadow-lg border-2 border-white/50 backdrop-blur-sm"
            size="icon"
          >
            <RefreshCw className="h-7 w-7 text-white" />
          </Button>
        )}
      </div>
      
      {renderInstructionsModal()}
      
      <MatchingCompletionDialog
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        images={getCompletionImages()}
        onStarClaimed={handleStarClaimed}
        isMobileLandscape={false}
      />

      <MemoryExitConfirmationDialog
        open={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={handleConfirmExit}
      >
        <></>
      </MemoryExitConfirmationDialog>
    </div>
  );
}
