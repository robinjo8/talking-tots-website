// Generic Bingo game component for ArtikulacijaVaje (sredina/konec)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { useBingoGame } from "@/hooks/useBingoGame";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { BingoGrid } from "@/components/bingo/BingoGrid";
import { BingoReel } from "@/components/bingo/BingoReel";
import { BingoSuccessDialog } from "@/components/bingo/BingoSuccessDialog";
import { BingoCongratulationsDialog } from "@/components/bingo/BingoCongratulationsDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BingoWordData } from "@/data/artikulacijaVajeConfig";

interface GenericBingoGameProps {
  letter: string;
  displayLetter: string;
  title: string;
  wordsData: BingoWordData[];
  exerciseId: string;
  backPath?: string;
}

export function GenericBingoGame({ letter, displayLetter, title, wordsData, exerciseId, backPath = '/govorno-jezikovne-vaje/artikulacija' }: GenericBingoGameProps) {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const [starClaimed, setStarClaimed] = useState(false);
  const { recordExerciseCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();

  const {
    grid,
    drawnWord,
    isSpinning,
    showHint,
    showPopup,
    gameComplete,
    completedCount,
    winningLine,
    spinReel,
    handleCellClick,
    closePopup,
    resetGame
  } = useBingoGame({ words: wordsData, minWordsForWin: 8 });

  // Show congratulations when game is complete (BINGO achieved) - only if star not yet claimed
  useEffect(() => {
    if (gameComplete && winningLine && !showCongratulations && !showPopup && !starClaimed) {
      const timer = setTimeout(() => {
        setShowCongratulations(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameComplete, winningLine, showCongratulations, showPopup, starClaimed]);

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate(backPath);
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    setShowCongratulations(false);
    setStarClaimed(false);
    resetGame();
    setShowNewGameConfirmation(false);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handlePopupClose = () => {
    closePopup();
  };

  const handleStarClaimed = async () => {
    recordExerciseCompletion(exerciseId);
    setStarClaimed(true);
    setShowCongratulations(false);
    setShowNewGameButton(true);
    // Check for trophy after claiming star
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  };

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
      {/* Main content - flex layout to fit viewport */}
      <div className="h-full flex flex-col items-center justify-center p-2 md:p-4 gap-1 md:gap-2 md:scale-[1.2] md:origin-center">
        {/* Reel */}
        <BingoReel
          words={wordsData}
          drawnWord={drawnWord}
          isSpinning={isSpinning}
          onSpin={spinReel}
          disabled={gameComplete || showPopup}
        />
        
        {/* Grid */}
        <BingoGrid
          grid={grid}
          drawnWord={drawnWord?.word || null}
          showHint={showHint}
          onCellClick={handleCellClick}
          winningLine={winningLine?.cells || null}
        />

        {/* Drawn word label - below grid, fixed height to prevent layout shift */}
        <div className="h-8 md:h-10 flex items-center justify-center">
          {drawnWord && !isSpinning && (
            <div className="text-lg md:text-xl font-bold text-white drop-shadow-lg text-center">
              Najdi: <span className="text-yellow-300">{drawnWord.word}</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Menu Button - Left */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          align="start"
          side="top"
          sideOffset={8}
        >
          <button
            onClick={handleBack}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Nazaj</span>
          </button>
          <button
            onClick={handleNewGame}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🔄</span>
            <span className="font-medium">Nova igra</span>
          </button>
          <button
            onClick={handleInstructions}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">📖</span>
            <span className="font-medium">Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Game Button - appears after winning */}
      {showNewGameButton && (
        <button
          onClick={() => {
            setShowNewGameButton(false);
            setStarClaimed(false);
            resetGame();
          }}
          className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
        >
          <RefreshCw className="h-7 w-7 text-white" />
        </button>
      )}

      {/* Success Dialog - for each word */}
      {drawnWord && (
        <BingoSuccessDialog
          isOpen={showPopup}
          onClose={handlePopupClose}
          word={drawnWord}
          isLastWord={false}
          onStarClaimed={() => {}}
        />
      )}

      {/* Congratulations Dialog - BINGO win */}
      <BingoCongratulationsDialog
        isOpen={showCongratulations}
        onClose={() => setShowCongratulations(false)}
        onStarClaimed={handleStarClaimed}
      />

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="bingo"
      />

      {/* Exit Confirmation Dialog */}
      <MemoryExitConfirmationDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={handleConfirmExit}
      >
        <div />
      </MemoryExitConfirmationDialog>

      {/* New Game Confirmation Dialog */}
      <ConfirmDialog
        open={showNewGameConfirmation}
        onOpenChange={setShowNewGameConfirmation}
        title="Nova igra"
        description="Ali res želiš začeti novo igro? Ves napredek bo ponastavljen na začetno stanje."
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleConfirmNewGame}
        onCancel={() => setShowNewGameConfirmation(false)}
      />
    </div>
  );
}
