import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useGameMode } from "@/contexts/GameModeContext";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { SlidingPuzzle } from "@/components/puzzle/SlidingPuzzle";
import { SlidingPuzzle78 } from "@/components/puzzle/SlidingPuzzle78";
import { SlidingPuzzle910 } from "@/components/puzzle/SlidingPuzzle910";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { getImageUrl, type PuzzleImage } from "@/data/puzzleImages";
import type { DrsnaSestavljankaGameConfig } from "@/data/drsnaSestavljankaConfig";

interface GenericDrsnaSestavljankaGameProps {
  config: DrsnaSestavljankaGameConfig;
  backPath?: string;
  onGameComplete?: () => void;
}

export function GenericDrsnaSestavljankaGame({ config, backPath = '/govorne-igre/drsna-sestavljanka', onGameComplete }: GenericDrsnaSestavljankaGameProps) {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();
  const gameMode = useGameMode();
  const gameCompletedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  // Select random image for current puzzle
  const currentImage = useMemo(() => {
    const images = config.images;
    return images[Math.floor(Math.random() * images.length)];
  }, [puzzleKey, config.images]);

  const imageUrl = getImageUrl(currentImage.filename);

  // Get random images for completion dialog
  const completionImages = useMemo(() => {
    const shuffled = [...config.images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, config.completionImageCount).map(img => ({
      word: img.word,
      url: getImageUrl(img.filename),
      filename: img.filename
    }));
  }, [puzzleKey, config.images, config.completionImageCount]);

  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameDialog(true);
  };

  const handleConfirmNewGame = () => {
    gameCompletedRef.current = false;
    setShowNewGameButton(false);
    setPuzzleKey(prev => prev + 1);
    setShowNewGameDialog(false);
  };

  const handleStartNewGameDirect = () => {
    gameCompletedRef.current = false;
    setShowNewGameButton(false);
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = async () => {
    const logopedistChildId = gameMode.mode === 'logopedist' 
      ? gameMode.logopedistChildId 
      : undefined;
    recordGameCompletion('sliding_puzzle', config.trackingId, logopedistChildId);
    setShowNewGameButton(true);
    onGameComplete?.();
    // Check for trophy only in user mode
    if (gameMode.mode === 'user') {
      await new Promise(resolve => setTimeout(resolve, 500));
      await checkForNewTrophy();
    }
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  // Render appropriate puzzle component based on age group
  const renderPuzzle = () => {
    const puzzleProps = {
      key: puzzleKey,
      imageUrl,
      onComplete: handleComplete
    };

    switch (config.puzzleType) {
      case '78':
        return <SlidingPuzzle78 {...puzzleProps} />;
      case '910':
        return <SlidingPuzzle910 {...puzzleProps} />;
      case '34':
      default:
        // Use SlidingPuzzle34 for 3-4 age group, SlidingPuzzle for 5-6
        if (config.ageGroup === '34') {
          return <SlidingPuzzle34 {...puzzleProps} />;
        }
        return <SlidingPuzzle {...puzzleProps} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none game-container"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        {renderPuzzle()}
      </div>

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
            <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">🏠</span>
              <span className="font-medium">Nazaj</span>
            </button>
            <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">🔄</span>
              <span className="font-medium">Nova igra</span>
            </button>
            <button onClick={handleInstructions} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">📖</span>
              <span className="font-medium">Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {showNewGameButton && (
          <button
            onClick={handleStartNewGameDirect}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <RefreshCw className="h-7 w-7 text-white" />
          </button>
        )}
      </div>

      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
        type="sliding" 
      />
      
      <MatchingCompletionDialog 
        isOpen={showCompletion} 
        onClose={() => setShowCompletion(false)} 
        images={completionImages}
        onStarClaimed={handleStarClaimed} 
        instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE" 
        autoPlayAudio={true} 
      />
      
      <MemoryExitConfirmationDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={() => navigate(backPath)}
      >
        <div />
      </MemoryExitConfirmationDialog>
      
      <ConfirmDialog 
        open={showNewGameDialog} 
        onOpenChange={setShowNewGameDialog} 
        title="Nova igra" 
        description="Ali res želiš začeti novo igro?" 
        confirmText="Da" 
        cancelText="Ne" 
        onConfirm={handleConfirmNewGame} 
        onCancel={() => setShowNewGameDialog(false)} 
      />
    </div>
  );
}
