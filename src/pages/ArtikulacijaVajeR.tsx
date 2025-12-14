import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { FortuneWheel } from "@/components/wheel/FortuneWheel";
import { useFortuneWheel } from "@/hooks/useFortuneWheel";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const wordsDataR = [
  { word: "RACA", image: "raca.png", audio: "raca.m4a" },
  { word: "RAK", image: "rak.png", audio: "rak.m4a" },
  { word: "RAKETA", image: "raketa.png", audio: "raketa.m4a" },
  { word: "RAVNILO", image: "ravnilo.png", audio: "ravnilo.m4a" },
  { word: "REP", image: "rep.png", audio: "rep.m4a" },
  { word: "REPA", image: "repa.png", audio: "repa.m4a" },
  { word: "RIBA", image: "riba.png", audio: "riba.m4a" },
  { word: "ROBOT", image: "robot.png", audio: "robot.m4a" },
  { word: "ROKA", image: "roka.png", audio: "roka.m4a" },
  { word: "ROLKA", image: "rolka.png", audio: "rolka.m4a" },
  { word: "ROPOTULJICA", image: "ropotuljica.png", audio: "ropotuljica.m4a" },
  { word: "ROŽA", image: "roza.png", audio: "roza.m4a" }
];

export default function ArtikulacijaVajeR() {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    isSpinning,
    rotation,
    selectedWord,
    selectedIndex,
    showResult,
    spinWheel,
    resetWheel,
    closeResult,
  } = useFortuneWheel({ wordsData: wordsDataR });

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorno-jezikovne-vaje/artikulacija');
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    resetWheel();
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleStarClaimed = () => {
    // Star claimed, dialog will close automatically
    closeResult();
  };

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
      {/* Main content - Fortune Wheel */}
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          KOLO SREČE - R
        </h1>
        
        <FortuneWheel
          segmentCount={wordsDataR.length}
          rotation={rotation}
          isSpinning={isSpinning}
          onSpin={spinWheel}
          selectedIndex={selectedIndex}
        />
      </div>

      {/* Floating Menu Button */}
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
      {selectedWord && (
        <PuzzleSuccessDialog
          isOpen={showResult}
          onOpenChange={(open) => {
            if (!open) closeResult();
          }}
          completedImage={{
            filename: selectedWord.image,
            word: selectedWord.word,
            audio: selectedWord.audio,
          }}
          onStarClaimed={handleStarClaimed}
        />
      )}

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="articulation"
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
    </div>
  );
}
