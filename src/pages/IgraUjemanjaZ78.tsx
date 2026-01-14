import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from "@/components/AppLayout";
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';
import { FourColumnGame } from '@/components/matching/FourColumnGame';
import { FourColumnInstructionsModal } from '@/components/matching/FourColumnInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { getRandomFourColumnItems, FourColumnMatchingItem } from '@/data/threeColumnMatchingData';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function IgraUjemanjaZ78() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const letter = 'z';
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 'z'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  // Synchronous touch device detection
  const [isTouchDevice] = useState(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });

  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Orientation detection
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

  // Fullscreen and landscape lock for touch devices
  useEffect(() => {
    if (isTouchDevice) {
      document.documentElement.requestFullscreen?.();
      (screen.orientation as any)?.lock?.('landscape').catch(() => {});
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [isTouchDevice]);

  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setCompletedItems(items);
      setIsGameCompleted(true);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 'z');
    setItems(newItems);
    setCompletedItems([]);
    setIsGameCompleted(false);
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => navigate('/govorne-igre/igra-ujemanja');
  const handleStarClaimed = () => recordGameCompletion('matching_z_7-8');

  const effectiveFullscreen = isTouchDevice;

  if (effectiveFullscreen) {
    // Portrait mode - show rotate message
    if (isPortrait) {
      return (
        <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-xl font-medium">Za igranje igre prosim obrni telefon v ležeči položaj.</p>
          </div>
        </div>
      );
    }

    // Landscape mode - show game
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/oranzno_ozadje.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="h-full flex items-center justify-center relative z-10">
          <FourColumnGame
            key={gameKey}
            items={items}
            onGameComplete={handleGameComplete}
            isLandscape={true}
          />
        </div>
        
        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowExitDialog(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            
            <button
              onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }}
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

        <FourColumnInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

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
        
        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowExitDialog(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            
            <button
              onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }}
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

        <FourColumnInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

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
      </div>
    </AppLayout>
  );
}
