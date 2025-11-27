import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

const sImages = [
  { filename: 'sladoled.png', word: 'SLADOLED' },
  { filename: 'slika.png', word: 'SLIKA' },
  { filename: 'slon.png', word: 'SLON' },
  { filename: 'smreka.png', word: 'SMREKA' },
  { filename: 'snezak.png', word: 'SNEŽAK' },
  { filename: 'sonce.png', word: 'SONCE' },
  { filename: 'sova.png', word: 'SOVA' },
  { filename: 'stol.png', word: 'STOL' },
  { filename: 'svetilka.png', word: 'SVETILKA' },
  { filename: 'svincnik.png', word: 'SVINČNIK' }
];

const getRandomSImage = () => {
  const randomIndex = Math.floor(Math.random() * sImages.length);
  return sImages[randomIndex];
};

export default function SestavljankeS78() {
  return (
    <AgeGatedRoute requiredAgeGroup="7-8">
      <SestavljankeS78Content />
    </AgeGatedRoute>
  );
}

function SestavljankeS78Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomSImage());
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
    recordGameCompletion('puzzle', 'puzzle_s_16');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomSImage());
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
      <div className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none relative">
        {/* Background image layer */}
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <SimpleJigsaw 
              key={puzzleKey}
              imageUrl={imageUrl}
              gridCols={5}
              gridRows={5}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* Floating menu button */}
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
      <div className="w-full min-h-screen relative">
        {/* Background image layer */}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        
        <div className="relative z-10">
          <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={5}
            gridRows={5}
            onComplete={handleComplete}
          />
          </div>
          
          {/* Floating menu button */}
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
      </div>
    </AppLayout>
  );
}