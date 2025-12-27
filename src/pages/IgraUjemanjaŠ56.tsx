import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppLayout } from "@/components/AppLayout";
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';
import { ThreeColumnGame } from '@/components/matching/ThreeColumnGame';
import { MatchingInstructionsModal } from '@/components/matching/MatchingInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { getRandomThreeColumnItems, ThreeColumnMatchingItem } from '@/data/threeColumnMatchingData';
import { getAgeGroup } from '@/utils/ageUtils';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function IgraUjemanjaŠ56() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const letter = 'š'; // Fixed to 'š' for this component
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedItems, setCompletedItems] = useState<ThreeColumnMatchingItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();
  const [items, setItems] = useState<ThreeColumnMatchingItem[]>(() => getRandomThreeColumnItems(4, 'Š'));

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Check age group access and get appropriate age group
  const childAge = selectedChild?.age || 5; // Default to 5 for this age group
  const ageGroup = getAgeGroup(childAge);

  // Get letter data for three-column game (fixed to 'š')
  const upperCaseLetter = letter?.toUpperCase() || 'Š';
  
  // Debug logging
  console.log('Three column items:', items);

  // Handle game completion
  const handleGameComplete = (score: number, playedItems: ThreeColumnMatchingItem[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      console.log(`Game completed with score: ${score}`);
      setCompletedItems(playedItems);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCompletedItems([]);
    setItems(getRandomThreeColumnItems(4, 'Š'));
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate('/govorne-igre/igra-ujemanja');
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('matching_š_5-6');
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
          <div className="flex-1 overflow-hidden bg-muted/30 p-4">
            <ThreeColumnGame
              key={gameKey}
              items={items}
              onGameComplete={(score, playedItems) => handleGameComplete(score, playedItems)}
            />
          </div>
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={completedItems.length > 0 ? completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage })) : items.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
          onStarClaimed={handleStarClaimed}
        />

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
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
          <ThreeColumnGame
            key={gameKey}
            items={items}
            onGameComplete={(score, playedItems) => handleGameComplete(score, playedItems)}
          />
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
      <MatchingCompletionDialog
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        images={completedItems.length > 0 ? completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage })) : items.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))}
        onStarClaimed={handleStarClaimed}
      />

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
            size="icon"
          >
            <Home className="h-7 w-7 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="top"
          sideOffset={8}
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
        >
          <button onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100">
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button onClick={() => { setMenuOpen(false); handleNewGame(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100">
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button onClick={() => { setMenuOpen(false); setShowInstructions(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium">
            <span className="text-2xl">📖</span>
            <span>Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

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