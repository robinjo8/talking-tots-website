import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { wordsDataRSredinaKonec } from "@/data/bingoWordsR";
import { useBingoGame } from "@/hooks/useBingoGame";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { BingoGrid } from "@/components/bingo/BingoGrid";
import { BingoReel } from "@/components/bingo/BingoReel";
import { BingoSuccessDialog } from "@/components/bingo/BingoSuccessDialog";
import { BingoCongratulationsDialog } from "@/components/bingo/BingoCongratulationsDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ArtikulacijaVajeRSredinaKonec() {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { recordExerciseCompletion } = useEnhancedProgress();

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
  } = useBingoGame({ words: wordsDataRSredinaKonec, minWordsForWin: 8 });

  // Show congratulations when game is complete
  const handleGameComplete = () => {
    if (gameComplete && winningLine && !showCongratulations) {
      setShowCongratulations(true);
    }
  };

  // Check for game complete after each popup close
  if (gameComplete && winningLine && !showCongratulations && !showPopup) {
    setTimeout(() => setShowCongratulations(true), 100);
  }

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorno-jezikovne-vaje/artikulacija');
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    setShowCongratulations(false);
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

  const handleStarClaimed = () => {
    recordExerciseCompletion('artikulacija_bingo_r');
    setShowCongratulations(false);
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main content - flex layout to fit viewport */}
      <div className="h-full flex flex-col items-center justify-center p-2 md:p-4 gap-1 md:gap-2 md:scale-[1.2] md:origin-center">
        {/* Header row with title and progress */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center drop-shadow-lg">
            BINGO - R
          </h1>
          <div className="text-white text-sm md:text-base font-medium bg-white/20 px-3 py-1 rounded-full">
            {completedCount}/8
          </div>
        </div>
        
        {/* Reel */}
        <BingoReel
          words={wordsDataRSredinaKonec}
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
      <ConfirmDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        title="Zapusti igro"
        description="Ali res želiš zapustiti igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirmation(false)}
      />

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
