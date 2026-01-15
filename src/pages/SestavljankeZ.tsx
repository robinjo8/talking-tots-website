import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw } from "lucide-react";

const zImages = [
  { filename: 'zajec.png', word: 'ZAJEC' },
  { filename: 'zaslon.png', word: 'ZASLON' },
  { filename: 'zavesa.png', word: 'ZAVESA' },
  { filename: 'zebra.png', word: 'ZEBRA' },
  { filename: 'zlato.png', word: 'ZLATO' },
  { filename: 'zmaj.png', word: 'ZMAJ' },
  { filename: 'zob.png', word: 'ZOB' },
  { filename: 'zobotrebec.png', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.png', word: 'ZVEZDA' },
  { filename: 'zvezek.png', word: 'ZVEZEK' },
  { filename: 'zvocnik.png', word: 'ZVOČNIK' }
];

const getRandomZImage = () => {
  const randomIndex = Math.floor(Math.random() * zImages.length);
  return zImages[randomIndex];
};

export default function SestavljankeZ() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <SestavljankeZContent />
    </AgeGatedRoute>
  );
}

function SestavljankeZContent() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomZImage());
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  
  const [isTouchDevice] = useState(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 100));
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice && !isPortrait) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape');
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };
      requestFullscreen();
      lockLandscape();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {}
      };
    }
  }, [isTouchDevice, isPortrait]);
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', 'puzzle_z_6');
    setShowNewGameButton(true);
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomZImage());
    setPuzzleKey(prev => prev + 1);
    setShowNewGameButton(false);
  };

  const handleBack = () => {
    navigate("/govorne-igre/sestavljanke");
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  if (isTouchDevice) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none relative" style={{ backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {isTouchDevice && isPortrait ? (
          <div className="w-full h-full flex items-center justify-center px-6 text-center">
            <p className="text-base font-semibold text-foreground">Za igranje igre prosim obrni telefon v ležeči položaj.</p>
          </div>
        ) : (
          <SimpleJigsaw key={puzzleKey} imageUrl={imageUrl} gridCols={3} gridRows={3} onComplete={handleComplete} className="w-full h-full" />
        )}

        {!(isTouchDevice && isPortrait) && (
          <>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
                <button onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🏠</span><span>Nazaj</span></button>
                <button onClick={() => { setMenuOpen(false); handleNewGame(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🔄</span><span>Nova igra</span></button>
                <button onClick={() => { setMenuOpen(false); handleInstructions(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"><span className="text-2xl">📖</span><span>Navodila</span></button>
              </DropdownMenuContent>
            </DropdownMenu>
            {showNewGameButton && (<Button size="icon" onClick={handleNewGame} className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"><RefreshCw className="w-6 h-6" /></Button>)}
          </>
        )}

        <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={handleBack}><div /></MemoryExitConfirmationDialog>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <PuzzleSuccessDialog isOpen={showCompletion} onOpenChange={setShowCompletion} completedImage={currentImage} allImages={zImages} onStarClaimed={handleStarClaimed} />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen relative" style={{ backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="w-full flex justify-center items-center p-4 min-h-screen">
          <SimpleJigsaw key={puzzleKey} imageUrl={imageUrl} gridCols={3} gridRows={3} onComplete={handleComplete} />
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🏠</span><span>Nazaj</span></button>
            <button onClick={() => { setMenuOpen(false); handleNewGame(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🔄</span><span>Nova igra</span></button>
            <button onClick={() => { setMenuOpen(false); handleInstructions(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"><span className="text-2xl">📖</span><span>Navodila</span></button>
          </DropdownMenuContent>
        </DropdownMenu>

        <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={handleBack}><div /></MemoryExitConfirmationDialog>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        {showNewGameButton && (<Button size="icon" onClick={handleNewGame} className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"><RefreshCw className="w-6 h-6" /></Button>)}
        <PuzzleSuccessDialog isOpen={showCompletion} onOpenChange={setShowCompletion} completedImage={currentImage} allImages={zImages} onStarClaimed={handleStarClaimed} />
      </div>
    </AppLayout>
  );
}
