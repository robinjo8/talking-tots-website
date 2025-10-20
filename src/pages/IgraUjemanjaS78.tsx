import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppLayout } from "@/components/AppLayout";
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';
import { FourColumnGame } from '@/components/matching/FourColumnGame';
import { FourColumnInstructionsModal } from '@/components/matching/FourColumnInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { getRandomFourColumnItems, FourColumnMatchingItem } from '@/data/threeColumnMatchingData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';

export default function IgraUjemanjaS78() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const letter = 's';
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [items, setItems] = useState<FourColumnMatchingItem[]>(() => getRandomFourColumnItems(4, 's'));
  const [completedItems, setCompletedItems] = useState<FourColumnMatchingItem[]>([]);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const upperCaseLetter = letter?.toUpperCase() || 'S';

  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setCompletedItems(items);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    const newItems = getRandomFourColumnItems(4, 's');
    setItems(newItems);
    setCompletedItems([]);
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => navigate('/govorne-igre/igra-ujemanja');
  const handleInstructions = () => setShowInstructions(true);
  const handleStarClaimed = () => recordGameCompletion('matching_s_7-8');

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
        <div className="h-full flex flex-col">
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Igra ujemanja {upperCaseLetter} (7-8 let)</h2>
            <div className="flex justify-center gap-3">
              <MemoryExitConfirmationDialog onConfirm={handleBack}>
                <Button size="sm" variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Nazaj
                </Button>
              </MemoryExitConfirmationDialog>
              <Button onClick={handleNewGame} size="sm" className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button onClick={handleInstructions} size="sm" variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-muted/30 p-2">
            <FourColumnGame key={gameKey} items={items} onGameComplete={handleGameComplete} />
          </div>
        </div>
        <FourColumnInstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={completedItems.length > 0 ? completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage })) : items.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))} onStarClaimed={handleStarClaimed} />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <MemoryExitConfirmationDialog onConfirm={handleBack}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
          </MemoryExitConfirmationDialog>
          <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button variant="outline" onClick={handleInstructions} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
        </div>
        <div className="w-full bg-muted/30 flex justify-center items-center p-4 min-h-[calc(100vh-200px)]">
          <FourColumnGame key={gameKey} items={items} onGameComplete={handleGameComplete} />
        </div>
        <FourColumnInstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={completedItems.length > 0 ? completedItems.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage })) : items.map(item => ({ word: item.word, url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, filename: item.originalImage }))} onStarClaimed={handleStarClaimed} />
      </div>
    </AppLayout>
  );
}
