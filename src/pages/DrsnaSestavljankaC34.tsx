import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const cImages = [
  { filename: 'cedilo.png', word: 'CEDILO' },
  { filename: 'cekin.png', word: 'CEKIN' },
  { filename: 'cerkev.png', word: 'CERKEV' },
  { filename: 'cesta.png', word: 'CESTA' },
  { filename: 'cev.png', word: 'CEV' },
  { filename: 'cirkus.png', word: 'CIRKUS' },
  { filename: 'cisterna.png', word: 'CISTERNA' },
  { filename: 'cokla.png', word: 'COKLA' },
  { filename: 'copat.png', word: 'COPAT' },
  { filename: 'cvet.png', word: 'CVET' }
];

const getRandomCImage = () => {
  const randomIndex = Math.floor(Math.random() * cImages.length);
  return cImages[randomIndex];
};

export default function DrsnaSestavljankaC34() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <DrsnaSestavljankaC34Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaC34Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomCImage());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
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
    setCurrentImage(getRandomCImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/govorne-igre/drsna-sestavljanka");
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_c_3-4');
  };

  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          // Lock screen orientation - simple approach
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
      <div className="fixed inset-0 overflow-hidden relative">
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        <div className="relative z-10 h-full flex items-center justify-center overflow-hidden">
          <div className="w-full px-4">
            <SlidingPuzzle34
              key={puzzleKey}
              imageUrl={imageUrl}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20">
              <Home className="w-11 h-11" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]" sideOffset={8}>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="gap-2 w-full h-11 text-base justify-start" onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}>
                <ArrowLeft className="w-5 h-5" />
                Nazaj
              </Button>
              
              <Button onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start">
                <RotateCcw className="w-5 h-5" />
                Nova igra
              </Button>
              
              <Button variant="outline" onClick={() => {
                setShowInstructions(true);
                setMenuOpen(false);
              }} className="gap-2 w-full h-11 text-base justify-start">
                <BookOpen className="w-5 h-5" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO."
          autoPlayAudio={true}
        />

        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}>
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen relative">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        <div className="relative z-10 flex justify-center items-center p-4 min-h-screen">
          <SlidingPuzzle34
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20">
              <Home className="w-11 h-11" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]" sideOffset={8}>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="gap-2 w-full h-11 text-base justify-start" onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}>
                <ArrowLeft className="w-5 h-5" />
                Nazaj
              </Button>
              
              <Button onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start">
                <RotateCcw className="w-5 h-5" />
                Nova igra
              </Button>
              
              <Button variant="outline" onClick={() => {
                setShowInstructions(true);
                setMenuOpen(false);
              }} className="gap-2 w-full h-11 text-base justify-start">
                <BookOpen className="w-5 h-5" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO."
          autoPlayAudio={true}
        />

        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}>
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    </AppLayout>
  );
}