import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";

const rImages = [
  { filename: 'raca.png', word: 'RACA' },
  { filename: 'radar.png', word: 'RADAR' },
  { filename: 'radij.png', word: 'RADIJ' },
  { filename: 'radio.png', word: 'RADIO' },
  { filename: 'rak.png', word: 'RAK' },
  { filename: 'raketa.png', word: 'RAKETA' },
  { filename: 'rama.png', word: 'RAMA' },
  { filename: 'rampa.png', word: 'RAMPA' },
  { filename: 'rana.png', word: 'RANA' },
  { filename: 'ranc.png', word: 'RANČ' },
  { filename: 'rasa.png', word: 'RASA' },
  { filename: 'resa.png', word: 'RESA' },
  { filename: 'riba.png', word: 'RIBA' },
  { filename: 'robida.png', word: 'ROBIDA' },
  { filename: 'roka.png', word: 'ROKA' },
  { filename: 'rosa.png', word: 'ROSA' },
  { filename: 'rozina.png', word: 'ROZINA' },
  { filename: 'roza.png', word: 'ROŽA' }
];

export default function DrsnaSestavljankaR34() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <DrsnaSestavljankaR34Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaR34Content() {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const currentImage = useMemo(() => rImages[Math.floor(Math.random() * rImages.length)], [puzzleKey]);
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;

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
    setPuzzleKey(prev => prev + 1);
    setShowNewGameDialog(false);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_r_3-4');
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
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
      {/* Main content */}
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          DRSNA SESTAVLJANKA - R
        </h1>
        
        <div className="w-full max-w-md">
          <SlidingPuzzle34 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
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

      {/* Instructions Modal */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
        type="sliding" 
      />

      {/* Puzzle Success Dialog */}
      <PuzzleSuccessDialog
        isOpen={showCompletion}
        onOpenChange={setShowCompletion}
        completedImage={currentImage}
        onStarClaimed={handleStarClaimed}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        title="Zapusti igro"
        description="Ali res želiš zapustiti igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* New Game Confirmation Dialog */}
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
