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
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';

export default function IgraUjemanjaR56() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const letter = 'r'; // Fixed to 'r' for this component
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedItems, setCompletedItems] = useState<ThreeColumnMatchingItem[]>([]);
  const gameCompletedRef = useRef(false);
  const { recordGameCompletion } = useEnhancedProgress();

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Check age group access and get appropriate age group
  const childAge = selectedChild?.age || 5; // Default to 5 for this age group
  const ageGroup = getAgeGroup(childAge);

  // Get letter data for three-column game (fixed to 'r')
  const upperCaseLetter = letter?.toUpperCase() || 'R';
  
  // Get 4 random items for the three-column game
  const items = getRandomThreeColumnItems(4, 'R');
  
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
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate('/govorne-igre/igra-ujemanja');
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('matching_r_5-6');
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
        <div className="h-full flex flex-col">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Igra ujemanja {upperCaseLetter}</h2>
            <div className="flex justify-center gap-3">
              <MemoryExitConfirmationDialog onConfirm={handleBack}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Nazaj
                </Button>
              </MemoryExitConfirmationDialog>
              
              <Button
                onClick={handleNewGame}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              
              <Button
                onClick={handleInstructions}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>

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
          images={completedItems.length > 0 ? completedItems.map(item => ({ 
            word: item.word, 
            url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, 
            filename: item.originalImage,
            audio_url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${item.audioFile}`
          })) : items.map(item => ({ 
            word: item.word, 
            url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, 
            filename: item.originalImage,
            audio_url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${item.audioFile}`
          }))}
          onStarClaimed={handleStarClaimed}
        />
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
          images={completedItems.length > 0 ? completedItems.map(item => ({ 
            word: item.word, 
            url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, 
            filename: item.originalImage,
            audio_url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${item.audioFile}`
          })) : items.map(item => ({ 
            word: item.word, 
            url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`, 
            filename: item.originalImage,
            audio_url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${item.audioFile}`
          }))}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    </AppLayout>
  );
}