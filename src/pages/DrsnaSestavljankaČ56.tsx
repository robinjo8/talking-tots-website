import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle } from "@/components/puzzle/SlidingPuzzle";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";

const čImages = [
  { filename: 'caj.png', word: 'ČAJ' },
  { filename: 'casopis.png', word: 'ČASOPIS' },
  { filename: 'cebela.png', word: 'ČEBELA' },
  { filename: 'cebula.png', word: 'ČEBULA' },
  { filename: 'cesen.png', word: 'ČESEN' },
  { filename: 'cevlji.png', word: 'ČEVLJI' },
  { filename: 'cokolada.png', word: 'ČOKOLADA' },
  { filename: 'coln.png', word: 'ČOLN' },
  { filename: 'copic.png', word: 'ČOPIČ' },
  { filename: 'crke.png', word: 'ČRKE' }
];

export default function DrsnaSestavljankaČ56() {
  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <DrsnaSestavljankaČ56Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaČ56Content() {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const currentImage = useMemo(() => čImages[Math.floor(Math.random() * čImages.length)], [puzzleKey]);
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
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_č_5-6');
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
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          DRSNA SESTAVLJANKA - Č
        </h1>
        
        <div className="w-full max-w-md">
          <SlidingPuzzle key={puzzleKey} imageUrl={imageUrl} onComplete={handleComplete} />
        </div>
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
          <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🏠</span><span className="font-medium">Nazaj</span></button>
          <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🔄</span><span className="font-medium">Nova igra</span></button>
          <button onClick={handleInstructions} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">📖</span><span className="font-medium">Navodila</span></button>
        </DropdownMenuContent>
      </DropdownMenu>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
      <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]} onStarClaimed={handleStarClaimed} instructionText="KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO." autoPlayAudio={true} />
      <ConfirmDialog open={showExitDialog} onOpenChange={setShowExitDialog} title="Zapusti igro" description="Ali res želiš zapustiti igro?" confirmText="Da" cancelText="Ne" onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")} onCancel={() => setShowExitDialog(false)} />
      <ConfirmDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} title="Nova igra" description="Ali res želiš začeti novo igro?" confirmText="Da" cancelText="Ne" onConfirm={handleConfirmNewGame} onCancel={() => setShowNewGameDialog(false)} />
    </div>
  );
}
