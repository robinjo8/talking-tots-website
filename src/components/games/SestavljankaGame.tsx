/**
 * Generic Sestavljanka (Puzzle) Game Component
 * Replaces 36 individual page files with one configurable component
 */
import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home, RefreshCw } from "lucide-react";
import { 
  SESTAVLJANKE_IMAGES, 
  AGE_GRID_CONFIG, 
  AGE_GROUP_MAP,
  getRandomImage,
  type GameImage 
} from "@/config/gameData/sestavljankeImages";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

interface SestavljankaGameProps {
  letter: string;  // c, č, k, l, r, s, š, z, ž
  ageGroup: string; // '', '56', '78', '910'
}

export function SestavljankaGame({ letter, ageGroup }: SestavljankaGameProps) {
  const requiredAgeGroup = AGE_GROUP_MAP[ageGroup] || '3-4';
  
  return (
    <AgeGatedRoute requiredAgeGroup={requiredAgeGroup}>
      <SestavljankaGameContent letter={letter} ageGroup={ageGroup} />
    </AgeGatedRoute>
  );
}

function SestavljankaGameContent({ letter, ageGroup }: SestavljankaGameProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState<GameImage>(() => getRandomImage(letter));
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  
  const effectiveFullscreen = isMobile;
  
  // Get grid configuration for age group
  const gridConfig = AGE_GRID_CONFIG[ageGroup] || AGE_GRID_CONFIG[''];
  const images = SESTAVLJANKE_IMAGES[letter] || SESTAVLJANKE_IMAGES['c'];
  
  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/slike/${currentImage.filename}`;
  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.png`;
  const progressId = `puzzle_${letter}_${gridConfig.progressId}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', progressId);
    setShowNewGameButton(true);
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomImage(letter));
    setPuzzleKey(prev => prev + 1);
    setShowNewGameButton(false);
  };

  const handleBack = () => {
    navigate("/govorne-igre/sestavljanke");
  };

  // Enable fullscreen and orientation lock on mobile
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

  const MenuButton = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
          <Home className="w-8 h-8 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
        <button
          onClick={() => { setMenuOpen(false); setShowExitDialog(true); }}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🏠</span>
          <span>Nazaj</span>
        </button>
        <button
          onClick={() => { setMenuOpen(false); handleNewGame(); }}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
        >
          <span className="text-2xl">🔄</span>
          <span>Nova igra</span>
        </button>
        <button
          onClick={() => { setMenuOpen(false); setShowInstructions(true); }}
          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
        >
          <span className="text-2xl">📖</span>
          <span>Navodila</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NewGameButton = () => showNewGameButton ? (
    <Button
      size="icon"
      onClick={handleNewGame}
      className="fixed bottom-4 left-24 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg"
    >
      <RefreshCw className="w-6 h-6" />
    </Button>
  ) : null;

  if (effectiveFullscreen) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none relative"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <SimpleJigsaw 
          key={puzzleKey}
          imageUrl={imageUrl}
          gridCols={gridConfig.gridCols}
          gridRows={gridConfig.gridRows}
          onComplete={handleComplete}
          className="w-full h-full"
        />

        <MenuButton />
        <NewGameButton />

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
          allImages={images}
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
          backgroundImage: `url('${backgroundImageUrl}')`,
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
            gridCols={gridConfig.gridCols}
            gridRows={gridConfig.gridRows}
            onComplete={handleComplete}
          />
        </div>

        <MenuButton />
        <NewGameButton />

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
          allImages={images}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    </AppLayout>
  );
}

export default SestavljankaGame;
