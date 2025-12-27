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

export default function IgraUjemanjaK910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <IgraUjemanjaK910Content />
    </AgeGatedRoute>
  );
}

function IgraUjemanjaK910Content() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const letter = 'k'; // Fixed to 'k' for this component
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 'k'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Get letter data for four-column game (fixed to 'k')
  const upperCaseLetter = letter?.toUpperCase() || 'K';
  
  // Debug logging
  console.log('Four column items:', items);

  // Handle game completion
  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setCompletedItems(items); // Save items that were just played
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('matching_k_9-10');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 'k');
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
          {/* Game Area with gray background */}
          <div className="flex-1 overflow-hidden bg-muted/30 p-2">
            <FourColumnGame
              key={gameKey}
              items={items}
              onGameComplete={handleGameComplete}
            />
          </div>
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

        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center">
              <Home className="w-11 h-11" />
            </button>
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

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Zapusti igro</AlertDialogTitle>
              <AlertDialogDescription>
                Ali res želite prekiniti igro? Vaš napredek ne bo shranjen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Nadaljuj z igro</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmExit}>Zapusti</AlertDialogAction>
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

        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center">
              <Home className="w-11 h-11" />
            </button>
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

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Zapusti igro</AlertDialogTitle>
              <AlertDialogDescription>
                Ali res želite prekiniti igro? Vaš napredek ne bo shranjen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Nadaljuj z igro</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmExit}>Zapusti</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}