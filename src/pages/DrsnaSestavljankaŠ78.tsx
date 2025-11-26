import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle78 } from "@/components/puzzle/SlidingPuzzle78";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŠImage());
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  const effectiveFullscreen = isMobile;
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  const backgroundImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/47412.jpg";
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomŠImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_š_7-8');
  };

  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          try {
            if ('orientation' in screen && 'lock' in screen.orientation) {
              (screen.orientation as any).lock('portrait').catch(() => {
                console.log('Screen orientation lock not supported');
              });
            }
          } catch (error) {
            console.log('Screen orientation lock not available');
          }
        } catch (error) {
          console.log('Fullscreen or orientation lock not supported:', error);
        }
      };
      requestFullscreen();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden touch-none overscroll-none select-none">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="relative h-full flex items-center justify-center p-4">
          <SlidingPuzzle78 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
            className="w-full h-full"
          />
        </div>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg"
            >
              <Home className="h-8 w-8 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-background/95 backdrop-blur-sm">
            <DropdownMenuItem onClick={handleBack} className="cursor-pointer">
              Nazaj
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNewGame} className="cursor-pointer">
              Nova igra
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInstructions} className="cursor-pointer">
              Navodila
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        >
          <div />
        </MemoryExitConfirmationDialog>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative w-full min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="relative w-full flex justify-center items-center p-4 min-h-screen">
          <SlidingPuzzle78 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        </div>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg"
            >
              <Home className="h-8 w-8 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-background/95 backdrop-blur-sm">
            <DropdownMenuItem onClick={handleBack} className="cursor-pointer">
              Nazaj
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNewGame} className="cursor-pointer">
              Nova igra
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInstructions} className="cursor-pointer">
              Navodila
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        >
          <div />
        </MemoryExitConfirmationDialog>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    </AppLayout>
  );
}
