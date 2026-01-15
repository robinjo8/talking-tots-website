import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle78 } from "@/components/puzzle/SlidingPuzzle78";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw, RotateCcw } from "lucide-react";

const kImages = [
  { filename: 'kaca.png', word: 'KAČA' },
  { filename: 'kapa.png', word: 'KAPA' },
  { filename: 'kava.png', word: 'KAVA' },
  { filename: 'klavir.png', word: 'KLAVIR' },
  { filename: 'kljuc.png', word: 'KLJUČ' },
  { filename: 'klop.png', word: 'KLOP' },
  { filename: 'knjiga.png', word: 'KNJIGA' },
  { filename: 'kocka.png', word: 'KOCKA' },
  { filename: 'kokos_sadez.png', word: 'KOKOS' },
  { filename: 'kokos.png', word: 'KOKOŠ' },
  { filename: 'kolac.png', word: 'KOLAČ' },
  { filename: 'kolo.png', word: 'KOLO' },
  { filename: 'koruza.png', word: 'KORUZA' },
  { filename: 'kost.png', word: 'KOST' },
  { filename: 'kos.png', word: 'KOŠ' },
  { filename: 'kosara.png', word: 'KOŠARA' },
  { filename: 'koza.png', word: 'KOZA' },
  { filename: 'kozarec.png', word: 'KOZAREC' },
  { filename: 'koza_skin.png', word: 'KOŽA' },
  { filename: 'krava.png', word: 'KRAVA' },
  { filename: 'krof.png', word: 'KROF' },
  { filename: 'krog.png', word: 'KROG' },
  { filename: 'kroznik.png', word: 'KROŽNIK' },
  { filename: 'kruh.png', word: 'KRUH' },
  { filename: 'kumara.png', word: 'KUMARA' },
  { filename: 'kuza.png', word: 'KUŽA' }
];

export default function DrsnaSestavljankaK78() {
  return (
    <AgeGatedRoute requiredAgeGroup="7-8">
      <DrsnaSestavljankaK78Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaK78Content() {
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
  const [isPortrait, setIsPortrait] = useState(false);

  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });

  useEffect(() => {
    if (!isTouchDevice) return;

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();

    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    if ((window.screen?.orientation as any)?.lock && !isPortrait) {
      (window.screen.orientation as any).lock('landscape').catch(() => {});
    }

    if (document.documentElement.requestFullscreen && !document.fullscreenElement && !isPortrait) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isTouchDevice, isPortrait]);

  const currentImage = useMemo(() => kImages[Math.floor(Math.random() * kImages.length)], [puzzleKey]);
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;

  // Get 5 random images for completion dialog
  const completionImages = useMemo(() => {
    const shuffled = [...kImages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map(img => ({
      word: img.word,
      url: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${img.filename}`,
      filename: img.filename
    }));
  }, [puzzleKey]);

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
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_k_7-8');
    setShowNewGameButton(true);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  if (isTouchDevice && isPortrait) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center select-none p-8"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl border-4 border-orange-300 max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <RotateCcw className="w-10 h-10 text-white" />
          </div>
          <p className="text-2xl font-bold text-center text-gray-700 uppercase">
            Obrni telefon za igranje
          </p>
          <div className="flex items-center gap-2 text-orange-500">
            <span className="text-4xl">📱</span>
            <span className="text-2xl">→</span>
            <span className="text-4xl rotate-90">📱</span>
          </div>
        </div>
      </div>
    );
  }

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
        <SlidingPuzzle78 key={puzzleKey} imageUrl={imageUrl} onComplete={handleComplete} />
      </div>

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
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
        {showNewGameButton && (
          <Button 
            onClick={handleStartNewGameDirect} 
            className="rounded-full w-16 h-16 bg-sky-400 hover:bg-sky-500 shadow-lg border-2 border-white/50 backdrop-blur-sm" 
            size="icon"
          >
            <RefreshCw className="h-7 w-7 text-white" />
          </Button>
        )}
      </div>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
      <MatchingCompletionDialog isOpen={showCompletion} onClose={() => setShowCompletion(false)} images={completionImages} onStarClaimed={handleStarClaimed} instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE" autoPlayAudio={true} />
      <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}><div /></MemoryExitConfirmationDialog>
      <ConfirmDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} title="Nova igra" description="Ali res želiš začeti novo igro?" confirmText="Da" cancelText="Ne" onConfirm={handleConfirmNewGame} onCancel={() => setShowNewGameDialog(false)} />
    </div>
  );
}