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

  // Synchronous touch device detection
  const [isTouchDevice] = useState(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });

  // Orientation detection
  const [isPortrait, setIsPortrait] = useState(() => {
    return window.innerHeight > window.innerWidth;
  });

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

  // Listen for orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Request fullscreen and lock orientation on touch devices
  useEffect(() => {
    if (isTouchDevice && !isPortrait) {
      const requestFullscreenAndLock = async () => {
        try {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          }
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape');
          }
        } catch (err) {
          console.log('Fullscreen/orientation lock not available:', err);
        }
      };
      requestFullscreenAndLock();
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      if (screen.orientation && 'unlock' in screen.orientation) {
        try {
          (screen.orientation as any).unlock();
        } catch (err) {}
      }
    };
  }, [isTouchDevice, isPortrait]);

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

  // Get completion images based on game type - memoized to prevent re-renders
  const completionImages = useMemo(() => {
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
  }, [config.gameType, playedImages, gameImages, threeColumnItems, fourColumnItems]);

  // Render appropriate game component
  const renderGame = () => {
    switch (config.gameType) {
      case 'matching':
        return (
          <MatchingGame
            key={gameKey}
            images={gameImages}
            numColumns={config.numColumns}
            onGameComplete={handleMatchingComplete}
            isLandscape={isTouchDevice}
          />
        );
      case 'threeColumn':
        return (
          <ThreeColumnGame
            key={gameKey}
            items={threeColumnItems}
            onGameComplete={handleThreeColumnComplete}
            isLandscape={isTouchDevice}
          />
        );
      case 'fourColumn':
        return (
          <FourColumnGame
            key={gameKey}
            items={fourColumnItems}
            onGameComplete={handleFourColumnComplete}
            isLandscape={isTouchDevice}
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

  const showRotateMessage = isTouchDevice && isPortrait;

  return (
    <div className="min-h-screen bg-background relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/oranzno_ozadje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {showRotateMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500">
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-xl font-bold">Za igranje igre prosim obrni telefon v ležeči položaj</p>
          </div>
        </div>
      ) : (
        <>
          <div className="h-full flex items-center justify-center relative z-10">
            {renderGame()}
          </div>
          
          {renderInstructionsModal()}
          
          <MatchingCompletionDialog
            isOpen={showCompletion}
            onClose={() => setShowCompletion(false)}
            images={completionImages}
            onStarClaimed={handleStarClaimed}
          />

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
              className="fixed bottom-4 left-24 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <RefreshCw className="h-7 w-7 text-white" />
            </Button>
          )}

          <MemoryExitConfirmationDialog
            open={showExitDialog} 
            onOpenChange={setShowExitDialog} 
            onConfirm={handleConfirmExit}
          >
            <div />
          </MemoryExitConfirmationDialog>
        </>
      )}
    </div>
  );
}
