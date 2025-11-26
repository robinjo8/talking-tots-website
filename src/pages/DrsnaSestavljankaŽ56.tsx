import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle } from "@/components/puzzle/SlidingPuzzle";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const žImages = [
  { filename: 'zaba.png', word: 'ŽABA' },
  { filename: 'zaga.png', word: 'ŽAGA' },
  { filename: 'zarnica.png', word: 'ŽARNICA' },
  { filename: 'zebelj.png', word: 'ŽEBELJ' },
  { filename: 'zelva.png', word: 'ŽELVA' },
  { filename: 'zerjav.png', word: 'ŽERJAV' },
  { filename: 'zirafa.png', word: 'ŽIRAFA' },
  { filename: 'zlica.png', word: 'ŽLICA' },
  { filename: 'zoga.png', word: 'ŽOGA' },
  { filename: 'zolna.png', word: 'ŽOLNA' }
];

const getRandomŽImage = () => {
  const randomIndex = Math.floor(Math.random() * žImages.length);
  return žImages[randomIndex];
};

export default function DrsnaSestavljankaŽ56() {
  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <DrsnaSestavljankaŽ56Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaŽ56Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŽImage());
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
    setCurrentImage(getRandomŽImage());
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
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_ž_5-6');
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
          <SlidingPuzzle 
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
          <SlidingPuzzle 
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
