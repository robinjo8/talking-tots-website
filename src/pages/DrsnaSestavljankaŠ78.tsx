import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle78 } from "@/components/puzzle/SlidingPuzzle78";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";

const šImages = [
  { filename: 'sah.png', word: 'ŠAH' },
  { filename: 'sal.png', word: 'ŠAL' },
  { filename: 'scetka.png', word: 'ŠČETKA' },
  { filename: 'skarje.png', word: 'ŠKARJE' },
  { filename: 'skatla.png', word: 'ŠKATLA' },
  { filename: 'skoljka.png', word: 'ŠKOLJKA' },
  { filename: 'sopek.png', word: 'ŠOPEK' },
  { filename: 'sotor.png', word: 'ŠOTOR' },
  { filename: 'stampiljka.png', word: 'ŠTAMPILJKA' },
  { filename: 'storklja.png', word: 'ŠTORKLJA' }
];

const getRandomŠImage = () => {
  const randomIndex = Math.floor(Math.random() * šImages.length);
  return šImages[randomIndex];
};

export default function DrsnaSestavljankaŠ78() {
  return (
    <AgeGatedRoute requiredAgeGroup="7-8">
      <DrsnaSestavljankaŠ78Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaŠ78Content() {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŠImage);
  const [menuOpen, setMenuOpen] = useState(false);
  const gameCompletedRef = useRef(false);

  const backgroundImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png";
  const imageUrl = useMemo(() => `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`, [currentImage.filename]);

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
    setCurrentImage(getRandomŠImage());
    setPuzzleKey(prev => prev + 1);
    setShowNewGameDialog(false);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_š_7-8');
  };

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          DRSNA SESTAVLJANKA - Š
        </h1>
        
        <SlidingPuzzle78 
          key={puzzleKey}
          imageUrl={imageUrl}
          onComplete={handleComplete}
        />
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 flex items-center justify-center">
            <Home className="h-7 w-7 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="mb-2 ml-4 bg-white/95 border-2 border-orange-200 shadow-xl">
          <button onClick={handleBack} className="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center gap-3 rounded-t-md transition-colors">
            <span className="text-2xl">🏠</span>
            <span className="font-semibold">Nazaj</span>
          </button>
          <button onClick={handleNewGame} className="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center gap-3 transition-colors">
            <span className="text-2xl">🔄</span>
            <span className="font-semibold">Nova igra</span>
          </button>
          <button onClick={() => { setMenuOpen(false); setShowInstructions(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center gap-3 rounded-b-md transition-colors">
            <span className="text-2xl">📖</span>
            <span className="font-semibold">Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
      <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]} onStarClaimed={handleStarClaimed} instructionText="KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO." autoPlayAudio={true} />
      <ConfirmDialog open={showExitDialog} onOpenChange={setShowExitDialog} title="Zapusti igro" description="Ali res želiš zapustiti igro?" confirmText="Da" cancelText="Ne" onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")} onCancel={() => setShowExitDialog(false)} />
      <ConfirmDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} title="Nova igra" description="Ali res želiš začeti novo igro?" confirmText="Da" cancelText="Ne" onConfirm={handleConfirmNewGame} onCancel={() => setShowNewGameDialog(false)} />
    </div>
  );
}
