import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft, Home } from "lucide-react";

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

export default function SestavljankeŠ() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <SestavljankeŠContent />
    </AgeGatedRoute>
  );
}

function SestavljankeŠContent() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŠImage());
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', 'puzzle_š_6');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomŠImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/govorne-igre/sestavljanke");
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  // Enable fullscreen and portrait lock on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };

      const lockPortrait = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('portrait');
          }
        } catch (error) {
          console.log('Portrait lock not supported:', error);
        }
      };

      requestFullscreen();
      lockPortrait();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Orientation unlock error:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  if (effectiveFullscreen) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none relative"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/background-gradient-lights.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <SimpleJigsaw 
          key={puzzleKey}
          imageUrl={imageUrl}
          gridCols={3}
          gridRows={3}
          onComplete={handleComplete}
          className="w-full h-full"
        />

        {/* Floating Menu Button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20"
            >
              <Home className="w-11 h-11" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="start"
            sideOffset={8}
            className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="gap-2 w-full h-11 text-base justify-start"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExitDialog(true);
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Nazaj
              </Button>
              
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  handleNewGame();
                }}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start"
              >
                <RotateCcw className="w-5 h-5" />
                Nova igra
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  handleInstructions();
                }}
                className="gap-2 w-full h-11 text-base justify-start"
              >
                <BookOpen className="w-5 h-5" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <MemoryExitConfirmationDialog 
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          onConfirm={handleBack}
        >
          <div />
        </MemoryExitConfirmationDialog>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

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
      <div 
        className="w-full min-h-screen relative"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/background-gradient-lights.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full flex justify-center items-center p-4 min-h-screen">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={3}
            gridRows={3}
            onComplete={handleComplete}
          />
        </div>

        {/* Floating Menu Button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20"
            >
              <Home className="w-11 h-11" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="start"
            sideOffset={8}
            className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="gap-2 w-full h-11 text-base justify-start"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExitDialog(true);
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Nazaj
              </Button>
              
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  handleNewGame();
                }}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start"
              >
                <RotateCcw className="w-5 h-5" />
                Nova igra
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  handleInstructions();
                }}
                className="gap-2 w-full h-11 text-base justify-start"
              >
                <BookOpen className="w-5 h-5" />
                Navodila
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <MemoryExitConfirmationDialog 
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          onConfirm={handleBack}
        >
          <div />
        </MemoryExitConfirmationDialog>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

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