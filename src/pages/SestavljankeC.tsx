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

export default function SestavljankeC() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <SestavljankeCContent />
    </AgeGatedRoute>
  );
}

function SestavljankeCContent() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomCImage());
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
    recordGameCompletion('puzzle', 'puzzle_c_6');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomCImage());
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

        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm">
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🏠</span>
              <span>Nazaj</span>
            </button>
            
            <button
              onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🔄</span>
              <span>Nova igra</span>
            </button>
            
            <button
              onClick={() => {
                setShowInstructions(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-xl">📖</span>
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
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
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

        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm">
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => {
                setShowExitDialog(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🏠</span>
              <span>Nazaj</span>
            </button>
            
            <button
              onClick={() => {
                handleNewGame();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🔄</span>
              <span>Nova igra</span>
            </button>
            
            <button
              onClick={() => {
                setShowInstructions(true);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-xl">📖</span>
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