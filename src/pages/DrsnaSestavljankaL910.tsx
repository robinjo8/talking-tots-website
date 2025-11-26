import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle910 } from "@/components/puzzle/SlidingPuzzle910";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, Home } from "lucide-react";

const lImages = [
  { filename: 'ladja.png', word: 'LADJA' },
  { filename: 'led.png', word: 'LED' },
  { filename: 'letalo.png', word: 'LETALO' },
  { filename: 'lev.png', word: 'LEV' },
  { filename: 'list.png', word: 'LIST' },
  { filename: 'lizika.png', word: 'LIZIKA' },
  { filename: 'lonec.png', word: 'LONEC' },
  { filename: 'lopar.png', word: 'LOPAR' },
  { filename: 'lubenica.png', word: 'LUBENICA' },
  { filename: 'luc.png', word: 'LUČ' }
];

const getRandomLImage = () => {
  const randomIndex = Math.floor(Math.random() * lImages.length);
  return lImages[randomIndex];
};

export default function DrsnaSestavljankaL910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <DrsnaSestavljankaL910Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaL910Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomLImage());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  const effectiveFullscreen = isMobile;
  
  const backgroundImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/47412.jpg";
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomLImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_l_9-10');
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
      <div className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="relative h-full flex items-center justify-center p-4">
          <SlidingPuzzle910 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
            className="w-full h-full"
          />
        </div>
        
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg"
              size="icon"
            >
              <Home className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 mb-2 bg-background/95 backdrop-blur-sm border-2">
            <div className="flex flex-col gap-2 p-2">
              <Button onClick={handleBack} variant="ghost" className="justify-start gap-2 w-full">
                Nazaj
              </Button>
              <Button onClick={handleNewGame} variant="ghost" className="justify-start gap-2 w-full">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button onClick={() => { setMenuOpen(false); setShowInstructions(true); }} variant="ghost" className="justify-start gap-2 w-full">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
        
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate('/govorne-igre/drsna-sestavljanka')}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="w-full flex justify-center items-center p-4 min-h-screen">
          <SlidingPuzzle910 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        </div>
        
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg"
              size="icon"
            >
              <Home className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 mb-2 bg-background/95 backdrop-blur-sm border-2">
            <div className="flex flex-col gap-2 p-2">
              <Button onClick={handleBack} variant="ghost" className="justify-start gap-2 w-full">
                Nazaj
              </Button>
              <Button onClick={handleNewGame} variant="ghost" className="justify-start gap-2 w-full">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button onClick={() => { setMenuOpen(false); setShowInstructions(true); }} variant="ghost" className="justify-start gap-2 w-full">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
        
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate('/govorne-igre/drsna-sestavljanka')}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    </AppLayout>
  );
}