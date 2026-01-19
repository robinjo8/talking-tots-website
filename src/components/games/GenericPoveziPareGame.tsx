import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppLayout } from "@/components/AppLayout";
import { MatchingGame } from '@/components/matching/MatchingGame';
import { ThreeColumnGame } from '@/components/matching/ThreeColumnGame';
import { FourColumnGame } from '@/components/matching/FourColumnGame';
import { MatchingInstructionsModal } from '@/components/matching/MatchingInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { getLetterData, getImagesForAgeGroup } from '@/data/matchingGameData';
import { getRandomThreeColumnItems, getRandomFourColumnItems } from '@/data/threeColumnMatchingData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';
import { PoveziPareConfig } from '@/data/poveziPareConfig';

interface Props {
  config: PoveziPareConfig;
}

export function GenericPoveziPareGame({ config }: Props) {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const gameCompletedRef = useRef(false);

  // Get letter data
  const letterData = getLetterData(config.letter);

  // Get game items based on game type
  const getGameItems = () => {
    const letterKey = config.letter.toLowerCase();
    
    switch (config.gameType) {
      case 'threeColumn':
        return getRandomThreeColumnItems(4, letterKey);
      case 'fourColumn':
        return getRandomFourColumnItems(4, letterKey);
      case 'matching':
      default:
        return letterData ? getImagesForAgeGroup(letterData.images, config.requiredAgeGroup) : [];
    }
  };

  const items = config.gameType !== 'matching' ? getGameItems() : [];
  const images = config.gameType === 'matching' && letterData 
    ? getImagesForAgeGroup(letterData.images, config.requiredAgeGroup) 
    : [];

  // Handle game completion
  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate(`/govorne-igre/povezi-pare/${config.ageGroup}`);
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

  // Get completion images for dialog
  const getCompletionImages = () => {
    if (config.gameType === 'matching') {
      return images;
    }
    return (items as any[]).map(item => ({
      word: item.word,
      url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${item.originalImage}`,
      filename: item.originalImage
    }));
  };

  // Render the appropriate game component
  const renderGame = () => {
    switch (config.gameType) {
      case 'threeColumn':
        return (
          <ThreeColumnGame
            key={gameKey}
            items={items as any[]}
            onGameComplete={handleGameComplete}
          />
        );
      case 'fourColumn':
        return (
          <FourColumnGame
            key={gameKey}
            items={items as any[]}
            onGameComplete={handleGameComplete}
          />
        );
      case 'matching':
      default:
        return (
          <MatchingGame
            key={gameKey}
            images={images}
            numColumns={config.numColumns}
            onGameComplete={handleGameComplete}
            className="h-full"
          />
        );
    }
  };

  if (!letterData && config.gameType === 'matching') {
    return (
      <AppLayout>
        <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Napaka</h1>
            <p className="text-muted-foreground">Ni bilo mogoče naložiti podatkov za črko {config.letter}.</p>
            <Button 
              onClick={() => navigate('/govorne-igre')}
              className="mt-4"
            >
              Nazaj na igre
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Povezi pare - {config.letter}</h2>
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
              
              <Button
                variant="outline"
                onClick={handleBack}
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
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
          <div className="flex-1 overflow-hidden bg-muted/30 p-4">
            {renderGame()}
          </div>
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={getCompletionImages()}
        />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleNewGame} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={handleInstructions} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </div>
        
        <div className="w-full bg-muted/30 flex justify-center items-center p-4 min-h-[calc(100vh-200px)]">
          {renderGame()}
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={getCompletionImages()}
        />
      </div>
    </AppLayout>
  );
}
