import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Home } from 'lucide-react';

export default function IgraUjemanjaČ910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <IgraUjemanjaČ910Content />
    </AgeGatedRoute>
  );
}

function IgraUjemanjaČ910Content() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 'č'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  const handleStarClaimed = () => {
    recordGameCompletion('matching_č_9-10');
  };

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle game completion
  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setCompletedItems(items);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 'č');
    setItems(newItems);
    setCompletedItems([]);
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

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  // Fullscreen handling for mobile
  useEffect(() => {
    if (isMobile) {
      document.documentElement.requestFullscreen?.();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [isMobile]);

  const effectiveFullscreen = isMobile;

  if (effectiveFullscreen) {
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
        <div className="h-full flex flex-col relative z-10">
          {/* Game Area */}
          <div className="flex-1 overflow-hidden bg-muted/30 p-2">
            <FourColumnGame
              key={gameKey}
              items={items}
              onGameComplete={handleGameComplete}
            />
          </div>
        </div>

        {/* Floating Menu Button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-white/50 backdrop-blur-sm">
              <Home className="h-8 w-8" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={handleInstructions}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
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
          images={(completedItems.length > 0 ? completedItems : items).map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ali res želite prekiniti igro?</AlertDialogTitle>
              <AlertDialogDescription>
                Vaš napredek v tej igri ne bo shranjen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Prekliči</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmExit}>Nadaljuj</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

        {/* Floating Menu Button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-white/50 backdrop-blur-sm">
              <Home className="h-8 w-8" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={handleInstructions}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3 text-base font-medium"
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
          images={(completedItems.length > 0 ? completedItems : items).map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ali res želite prekiniti igro?</AlertDialogTitle>
              <AlertDialogDescription>
                Vaš napredek v tej igri ne bo shranjen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Prekliči</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmExit}>Nadaljuj</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
