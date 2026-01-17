import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { MatchingGame } from "@/components/matching/MatchingGame";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { getLetterData, getImagesForAgeGroup, MatchingGameImage } from "@/data/matchingGameData";
import { useState, useRef, useMemo, useEffect } from "react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

export default function IgraUjemanjaR() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const childName = selectedChild?.name;
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [playedImages, setPlayedImages] = useState<MatchingGameImage[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const gameCompletedRef = useRef(false);

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
  
  const gameImages = useMemo(() => {
    const letterData = getLetterData('R');
    return letterData ? getImagesForAgeGroup(letterData.images, '3-4') : [];
  }, [gameKey]);

  const handleGameComplete = (score: number, images: MatchingGameImage[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setPlayedImages(images);
      setIsGameCompleted(true);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setIsGameCompleted(false);
    setGameKey(prev => prev + 1);
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const handleBack = () => {
    navigate('/govorne-igre/igra-ujemanja');
  };

  const handleStarClaimed = () => {
    recordGameCompletion('memory', 'matching_r_3-4');
  };

  // Show rotate message on touch devices in portrait mode
  const showRotateMessage = isTouchDevice && isPortrait;

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
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
              <MatchingGame
                key={gameKey}
                images={gameImages}
                numColumns={2}
                onGameComplete={handleGameComplete}
                isLandscape={true}
              />
            </div>
            
            <MatchingInstructionsModal
              isOpen={showInstructions}
              onClose={() => setShowInstructions(false)}
            />
            
            <MatchingCompletionDialog
              isOpen={showCompletion}
              onClose={() => setShowCompletion(false)}
              images={playedImages.length > 0 ? playedImages : gameImages}
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
                  onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} 
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
                >
                  <span className="text-2xl">🏠</span>
                  <span>Nazaj</span>
                </button>
                <button 
                  onClick={() => { setMenuOpen(false); handleNewGame(); }} 
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
              onConfirm={handleBack}
            >
              <div />
            </MemoryExitConfirmationDialog>
          </>
        )}
      </div>
    </AgeGatedRoute>
  );
}
