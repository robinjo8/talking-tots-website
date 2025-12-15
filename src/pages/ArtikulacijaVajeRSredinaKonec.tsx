import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { wordsDataRSredinaKonec } from "@/data/bingoWordsR";
import { useBingoGame } from "@/hooks/useBingoGame";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { BingoGrid } from "@/components/bingo/BingoGrid";
import { BingoReel } from "@/components/bingo/BingoReel";
import { BingoSuccessDialog } from "@/components/bingo/BingoSuccessDialog";
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
    spinReel,
    handleCellClick,
    closePopup,
    resetGame
  } = useBingoGame({ words: wordsDataRSredinaKonec });

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
    closePopup();
  };

  const isLastWord = completedCount === 15 && showPopup; // 15 completed + 1 about to complete = 16

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main content */}
      <div className="min-h-full flex flex-col items-center p-4 pb-24 pt-8 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-lg">
          BINGO - R
        </h1>
        
        {/* Progress indicator */}
        <div className="text-white text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
          {completedCount}/16 polj
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
        />
        
        {/* Game complete message */}
        {gameComplete && !showPopup && (
          <div className="bg-yellow-400 text-black font-bold text-xl px-6 py-3 rounded-full animate-bounce">
            🎉 BRAVO! Zaključil si Bingo! 🎉
          </div>
        )}
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

      {/* Success Dialog */}
      {drawnWord && (
        <BingoSuccessDialog
          isOpen={showPopup}
          onClose={handlePopupClose}
          word={drawnWord}
          isLastWord={isLastWord}
          onStarClaimed={handleStarClaimed}
        />
      )}

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
