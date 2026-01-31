import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';
import { useTrophyContext } from '@/contexts/TrophyContext';
import { AppLayout } from "@/components/AppLayout";
import { MatchingGame } from '@/components/matching/MatchingGame';
import { ThreeColumnGame } from '@/components/matching/ThreeColumnGame';
import { FourColumnGame } from '@/components/matching/FourColumnGame';
import { MatchingInstructionsModal } from '@/components/matching/MatchingInstructionsModal';
import { MatchingCompletionDialog } from '@/components/matching/MatchingCompletionDialog';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { getLetterData, getImagesForAgeGroup } from '@/data/matchingGameData';
import { getRandomThreeColumnItems, getRandomFourColumnItems } from '@/data/threeColumnMatchingData';
import { Home, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PoveziPareConfig } from '@/data/poveziPareConfig';

interface Props {
  config: PoveziPareConfig;
}

export function GenericPoveziPareGame({ config }: Props) {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
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
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    gameCompletedRef.current = false;
    setShowNewGameButton(false);
    setGameKey(prev => prev + 1);
    setShowNewGameConfirmation(false);
  };

  const handleNewGameDirect = () => {
    gameCompletedRef.current = false;
    setShowNewGameButton(false);
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate(`/govorne-igre/povezi-pare/${config.ageGroup}`);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleStarClaimed = async () => {
    // Record star to Supabase
    recordGameCompletion('matching', `povezi-pare-${config.letter}`);
    setShowNewGameButton(true);
    // Check for trophy after claiming star
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
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

  // Floating menu component
  const FloatingMenu = () => (
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
          onClick={handleBack}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🏠</span>
          <span>Nazaj</span>
        </button>
        <button
          onClick={handleNewGame}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🔄</span>
          <span>Nova igra</span>
        </button>
        <button
          onClick={handleInstructions}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
        >
          <span className="text-2xl">📖</span>
          <span>Navodila</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // New game button component
  const NewGameButton = () => (
    showNewGameButton ? (
      <button
        onClick={handleNewGameDirect}
        className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
      >
        <RefreshCw className="h-7 w-7 text-white" />
      </button>
    ) : null
  );

  if (!letterData && config.gameType === 'matching') {
    return (
      <AppLayout>
        <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Napaka</h1>
            <p className="text-muted-foreground">Ni bilo mogoče naložiti podatkov za črko {config.letter}.</p>
            <button 
              onClick={() => navigate('/govorne-igre')}
              className="mt-4 px-4 py-2 bg-dragon-green text-white rounded-lg hover:bg-dragon-green/90"
            >
              Nazaj na igre
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (effectiveFullscreen) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden select-none"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-center text-white drop-shadow-lg">Povezi pare - {config.letter}</h2>
          </div>

          {/* Game Area */}
          <div className="flex-1 overflow-hidden p-4">
            {renderGame()}
          </div>
        </div>
        
        <FloatingMenu />
        <NewGameButton />
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={getCompletionImages()}
          onStarClaimed={handleStarClaimed}
        />

        <MemoryExitConfirmationDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          onConfirm={handleConfirmExit}
        >
          <span />
        </MemoryExitConfirmationDialog>

        <ConfirmDialog
          open={showNewGameConfirmation}
          onOpenChange={setShowNewGameConfirmation}
          title="Nova igra"
          description="Ali res želiš začeti novo igro?"
          confirmText="Da"
          cancelText="Ne"
          onConfirm={handleConfirmNewGame}
          onCancel={() => setShowNewGameConfirmation(false)}
        />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          POVEŽI PARE - {config.letter}
        </h1>
        
        <div className="w-full max-w-4xl">
          {renderGame()}
        </div>
      </div>

      <FloatingMenu />
      <NewGameButton />
      
      <MatchingInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      <MatchingCompletionDialog
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        images={getCompletionImages()}
        onStarClaimed={handleStarClaimed}
      />

      <MemoryExitConfirmationDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={handleConfirmExit}
      >
        <span />
      </MemoryExitConfirmationDialog>

      <ConfirmDialog
        open={showNewGameConfirmation}
        onOpenChange={setShowNewGameConfirmation}
        title="Nova igra"
        description="Ali res želiš začeti novo igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleConfirmNewGame}
        onCancel={() => setShowNewGameConfirmation(false)}
      />
    </div>
  );
}
