import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

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

export default function SestavljankeŠ910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <SestavljankeŠ910Content />
    </AgeGatedRoute>
  );
}

function SestavljankeŠ910Content() {
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
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', 'puzzle_š_20');
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
      requestFullscreen();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/background-gradient-lights.jpg`;

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none relative touch-none overscroll-none">
        {/* Background image layer */}
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
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
        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            sideOffset={8}
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          >
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
      <div className="w-full min-h-screen relative" style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            sideOffset={8}
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          >
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

        <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={6}
            gridRows={5}
            onComplete={handleComplete}
          />
        </div>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
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