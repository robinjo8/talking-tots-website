import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle910 } from "@/components/puzzle/SlidingPuzzle910";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw } from "lucide-react";

const zImages = [
  { filename: 'zajec.png', word: 'ZAJEC' },
  { filename: 'zaslon.png', word: 'ZASLON' },
  { filename: 'zavesa.png', word: 'ZAVESE' },
  { filename: 'zebra.png', word: 'ZEBRA' },
  { filename: 'zlato.png', word: 'ZLATO' },
  { filename: 'zmaj.png', word: 'ZMAJ' },
  { filename: 'zob.png', word: 'ZOB' },
  { filename: 'zobotrebec.png', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.png', word: 'ZVEZDA' },
  { filename: 'zvocnik.png', word: 'ZVOČNIK' }
];

export default function DrsnaSestavljankaZ910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <DrsnaSestavljankaZ910Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaZ910Content() {
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  const currentImage = useMemo(() => zImages[Math.floor(Math.random() * zImages.length)], [puzzleKey]);
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

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_z_9-10');
    setShowNewGameButton(true);
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
        <SlidingPuzzle910 key={puzzleKey} imageUrl={imageUrl} onComplete={handleComplete} />
      </div>

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        {showNewGameButton && (
          <Button
            onClick={handleStartNewGameDirect}
            className="h-14 px-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg border-2 border-white/50"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Nova igra
          </Button>
        )}
        
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
            <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🏠</span><span className="font-medium">Nazaj</span></button>
            <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🔄</span><span className="font-medium">Nova igra</span></button>
            <button onClick={handleInstructions} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">📖</span><span className="font-medium">Navodila</span></button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
      <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={[
        { word: currentImage.word, url: imageUrl, filename: currentImage.filename },
        { word: currentImage.word, url: imageUrl, filename: currentImage.filename },
        { word: currentImage.word, url: imageUrl, filename: currentImage.filename },
        { word: currentImage.word, url: imageUrl, filename: currentImage.filename }
      ]} onStarClaimed={handleStarClaimed} instructionText="KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO." autoPlayAudio={true} />
      <ConfirmDialog open={showExitDialog} onOpenChange={setShowExitDialog} title="Zapusti igro" description="Ali res želiš zapustiti igro?" confirmText="Da" cancelText="Ne" onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")} onCancel={() => setShowExitDialog(false)} />
      <ConfirmDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} title="Nova igra" description="Ali res želiš začeti novo igro?" confirmText="Da" cancelText="Ne" onConfirm={handleConfirmNewGame} onCancel={() => setShowNewGameDialog(false)} />
    </div>
  );
}