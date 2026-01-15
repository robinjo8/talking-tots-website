import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

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

const getRandomKImage = () => {
  const randomIndex = Math.floor(Math.random() * kImages.length);
  return kImages[randomIndex];
};

export default function SestavljankeK910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <SestavljankeK910Content />
    </AgeGatedRoute>
  );
}

function SestavljankeK910Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomKImage());
  const navigate = useNavigate();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const [isTouchDevice] = useState(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    return hasTouch && isSmallScreen;
  });

  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window !== 'undefined' && window.screen?.orientation) {
      return window.screen.orientation.type.includes('portrait');
    }
    return typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false;
  });

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

  const effectiveFullscreen = isTouchDevice;
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', 'puzzle_k_20');
    setShowNewGameButton(true);
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomKImage());
    setPuzzleKey(prev => prev + 1);
    setShowNewGameButton(false);
  };

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

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.png`;

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none relative touch-none overscroll-none">
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        {isTouchDevice && isPortrait ? (
          <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
            <p className="text-base font-semibold text-foreground">
              Za igranje igre prosim obrni telefon v ležeči položaj.
            </p>
          </div>
        ) : (
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <SimpleJigsaw 
                key={puzzleKey}
                imageUrl={imageUrl}
                gridCols={6}
                gridRows={5}
                onComplete={handleComplete}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
        
        {!(isTouchDevice && isPortrait) && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
              <button
                onClick={() => {
                  setShowExitDialog(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🏠</span>
                <span>Nazaj</span>
              </button>
              
              <button
                onClick={() => {
                  handleNewGame();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🔄</span>
                <span>Nova igra</span>
              </button>
              
              <button
                onClick={() => {
                  setShowInstructions(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!(isTouchDevice && isPortrait) && showNewGameButton && (
          <Button
            size="icon"
            onClick={handleNewGame}
            className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
        )}

        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate("/govorne-igre/sestavljanke")}
        >
          <div />
        </MemoryExitConfirmationDialog>
        
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />

        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          allImages={kImages}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen relative">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        <div className="relative z-10">
          <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={6}
            gridRows={5}
            onComplete={handleComplete}
          />
          </div>
          
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            
            <button
              onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            
            <button
              onClick={() => {
                setShowInstructions(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

          <MemoryExitConfirmationDialog 
            open={showExitDialog} 
            onOpenChange={setShowExitDialog} 
            onConfirm={() => navigate("/govorne-igre/sestavljanke")}
          >
            <div />
          </MemoryExitConfirmationDialog>
          
          <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
          
          {showNewGameButton && (
            <Button
              size="icon"
              onClick={handleNewGame}
              className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"
            >
              <RefreshCw className="w-6 h-6" />
            </Button>
          )}

          <PuzzleSuccessDialog
            isOpen={showCompletion}
            onOpenChange={setShowCompletion}
            completedImage={currentImage}
            allImages={kImages}
            onStarClaimed={handleStarClaimed}
          />
        </div>
      </div>
    </AppLayout>
  );
}