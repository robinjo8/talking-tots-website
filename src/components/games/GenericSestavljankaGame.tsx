// Generic Sestavljanka (Puzzle) game component
// Replaces 36 individual page components with a single configurable component

import { AppLayout } from "@/components/AppLayout";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { Home, RefreshCw } from "lucide-react";
import type { SestavljankeGameConfig } from "@/data/sestavljankeGameConfig";
import type { PuzzleImage } from "@/data/puzzleImages";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";
const BACKGROUND_URL = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.webp`;

interface GenericSestavljankaGameProps {
  config: SestavljankeGameConfig;
  backPath?: string;
}

// Helper to get random image from array
const getRandomImage = (images: PuzzleImage[]): PuzzleImage => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Extend PuzzleImage with audio for the game
interface GameImage extends PuzzleImage {
  audio?: string;
}

// Add audio to image if not present (derive from filename)
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  const baseName = image.filename.replace('.webp', '').replace('.png', '');
  return {
    ...image,
    audio: `${baseName}.m4a`
  };
};

export function GenericSestavljankaGame({ config, backPath = '/govorne-igre/sestavljanke' }: GenericSestavljankaGameProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState<GameImage>(() => 
    enrichImageWithAudio(getRandomImage(config.images))
  );
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const { checkForNewTrophy } = useTrophyContext();
  const gameCompletedRef = useRef(false);
  
  const effectiveFullscreen = isMobile;
  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/slike/${currentImage.filename}`;

  const handleComplete = useCallback(() => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  }, []);

  const handleStarClaimed = async () => {
    recordGameCompletion('puzzle', config.trackingId);
    setShowNewGameButton(true);
    // Check for trophy after short delay to allow progress to save
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(enrichImageWithAudio(getRandomImage(config.images)));
    setPuzzleKey(prev => prev + 1);
    setShowNewGameButton(false);
  };

  const handleBack = () => {
    setShowExitDialog(true);
    setMenuOpen(false);
  };

  // Preload background image for faster LCP
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = BACKGROUND_URL;
    link.type = 'image/webp';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Preload current puzzle image for faster loading
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, [imageUrl]);

  // Fullscreen effect for mobile
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

  // Floating menu component (shared between mobile and desktop)
  const FloatingMenu = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
          <Home className="w-8 h-8 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        side="top"
        sideOffset={8}
        className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
      >
        <button
          onClick={handleBack}
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
  );

  // New game button (appears after star claimed)
  const NewGameButton = () => (
    showNewGameButton ? (
      <button
        onClick={handleNewGame}
        className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
      >
        <RefreshCw className="h-7 w-7 text-white" />
      </button>
    ) : null
  );

  // Mobile fullscreen layout
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none relative touch-none overscroll-none">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('${BACKGROUND_URL}')` }} 
        />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <SimpleJigsaw 
              key={puzzleKey}
              imageUrl={imageUrl}
              gridCols={config.gridCols}
              gridRows={config.gridRows}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>

        <FloatingMenu />
        <NewGameButton />
        
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate(backPath)}
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
          allImages={config.images.map(enrichImageWithAudio)}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <AppLayout>
      <div 
        className="w-full min-h-screen relative"
        style={{
          backgroundImage: `url('${BACKGROUND_URL}')`,
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
            gridCols={config.gridCols}
            gridRows={config.gridRows}
            onComplete={handleComplete}
          />
        </div>

        <FloatingMenu />
        <NewGameButton />
        
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate(backPath)}
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
          allImages={config.images.map(enrichImageWithAudio)}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    </AppLayout>
  );
}
