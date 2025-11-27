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
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { getRandomFourColumnItems, FourColumnMatchingItem } from '@/data/threeColumnMatchingData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';

export default function IgraUjemanjaR910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <IgraUjemanjaR910Content />
    </AgeGatedRoute>
  );
}

function IgraUjemanjaR910Content() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const letter = 'r'; // Fixed to 'r' for this component
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 'r'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  const handleStarClaimed = () => {
    recordGameCompletion('matching_r_9-10');
  };

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Get letter data for four-column game (fixed to 'r')
  const upperCaseLetter = letter?.toUpperCase() || 'R';
  
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

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 'r');
    setItems(newItems);
    setCompletedItems([]);
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
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
            backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/background-gradient-lights.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="h-full flex flex-col relative z-10">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Igra ujemanja {upperCaseLetter} (9-10 let)</h2>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleNewGame}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
                variant="default"
              >
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              
              <MemoryExitConfirmationDialog onConfirm={handleBack}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Nazaj
                </Button>
              </MemoryExitConfirmationDialog>
              
              <Button
                variant="outline"
                onClick={handleInstructions}
                size="sm"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>

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
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background relative">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/background-gradient-lights.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="flex justify-center gap-4 p-4 relative z-10">
          <Button onClick={handleNewGame} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={handleInstructions} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
          <MemoryExitConfirmationDialog onConfirm={handleBack}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
          </MemoryExitConfirmationDialog>
        </div>
        
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
      </div>
    </AppLayout>
  );
}