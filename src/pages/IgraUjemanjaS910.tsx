import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';
import { FourColumnGame } from '@/components/matching/FourColumnGame';
import { FourColumnInstructionsModal } from '@/components/matching/FourColumnInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { getRandomFourColumnItems, FourColumnMatchingItem } from '@/data/threeColumnMatchingData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IgraUjemanjaS910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <IgraUjemanjaS910Content />
    </AgeGatedRoute>
  );
}

function IgraUjemanjaS910Content() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 's'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  // Touch device and orientation detection (synchronous init)
  const [isTouchDevice] = useState(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });
  const [isPortrait, setIsPortrait] = useState(false);

  const effectiveFullscreen = isTouchDevice;

  const handleStarClaimed = () => {
    recordGameCompletion('matching_s_9-10');
  };

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Orientation detection
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    checkOrientation();
    const handleOrientationChange = () => { setTimeout(checkOrientation, 100); };
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

  // Fullscreen and landscape lock for mobile
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

  // Handle game completion
  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setCompletedItems(items);
      setIsGameCompleted(true);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 's');
    setItems(newItems);
    setCompletedItems([]);
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

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/oranzno_ozadje.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative z-10 flex-1 flex items-center justify-center h-full w-full">
          {!isPortrait ? (
            <FourColumnGame
              key={gameKey}
              items={items}
              onGameComplete={handleGameComplete}
              isLandscape={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">Za igranje igre prosim obrni telefon v ležeči položaj.</p>
            </div>
          )}
        </div>
        
        <FourColumnInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={(completedItems.length > 0 ? completedItems : items).map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

        {!isPortrait && (
          <>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl z-[60]" sideOffset={8}>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
                  >
                    🏠 Nazaj
                  </button>
                  
                  <button
                    onClick={handleNewGame}
                    className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
                  >
                    🔄 Nova igra
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowInstructions(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
                  >
                    📖 Navodila
                  </button>
                </div>
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
          </>
        )}

        <MemoryExitConfirmationDialog
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={handleConfirmExit}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background relative">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/oranzno_ozadje.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="w-full bg-muted/30 flex justify-center items-center p-4 min-h-[calc(100vh-200px)] relative z-10">
          <FourColumnGame
            key={gameKey}
            items={items}
            onGameComplete={handleGameComplete}
          />
        </div>
        
        <FourColumnInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={(completedItems.length > 0 ? completedItems : items).map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl z-[60]" sideOffset={8}>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
              >
                🏠 Nazaj
              </button>
              
              <button
                onClick={handleNewGame}
                className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
              >
                🔄 Nova igra
              </button>
              
              <button
                onClick={() => {
                  setShowInstructions(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full h-11 px-3 text-base justify-start rounded-md hover:bg-muted"
              >
                📖 Navodila
              </button>
            </div>
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
      </div>
    </AppLayout>
  );
}
