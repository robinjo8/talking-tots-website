import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MazeGame } from "@/components/games/MazeGame";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Home } from "lucide-react";
import { matchingGameData } from "@/data/matchingGameData";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

const LabirintX = () => {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <LabirintXContent />
    </AgeGatedRoute>
  );
};

const LabirintXContent = () => {
  const navigate = useNavigate();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { recordGameCompletion } = useEnhancedProgress();
  const isMobile = useIsMobile();
  const { user, selectedChild } = useAuth();
  const gameCompletedRef = useRef(false);
  
  const effectiveFullscreen = isMobile;

  const completionImage = useMemo(() => {
    const letterData = matchingGameData.find(data => data.letter === "X");
    if (!letterData || letterData.images.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * letterData.images.length);
    return letterData.images[randomIndex];
  }, [gameKey]);

  const handleGameComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setGameKey(prev => prev + 1);
    setShowCompletion(false);
    setMenuOpen(false);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorne-igre/labirint');
  };

  const handleStarClaimed = async () => {
    await recordGameCompletion('memory_game', 'labirint-x');
    setShowCompletion(false);
  };

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/3858.jpg`;

  // Track orientation
  useEffect(() => {
    const updateOrientation = () => {
      if (typeof window !== 'undefined') {
        setIsLandscape(window.innerWidth >= window.innerHeight);
      }
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

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

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as any).lock('landscape-primary');
            } catch {
              await (screen.orientation as any).lock('landscape');
            }
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };

    requestFullscreen();
    lockLandscape();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        {/* Background image layer */}
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        
        {/* Game content */}
        <div className="relative z-10 flex-1 flex items-stretch justify-center overflow-hidden h-full">
          {isLandscape ? (
            <MazeGame key={gameKey} onComplete={handleGameComplete} cols={16} rows={9} />
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">
                Za igranje labirinta prosim obrni telefon v ležeči položaj.
              </p>
            </div>
          )}
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
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowInstructions(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ali res želite prekiniti igro?</AlertDialogTitle>
              <AlertDialogDescription>
                Trenutna igra bo izgubljena.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Prekliči</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmExit}>
                Potrdi
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="maze"
        />

        {completionImage && (
          <MatchingCompletionDialog
            isOpen={showCompletion}
            onClose={() => setShowCompletion(false)}
            images={[completionImage]}
            onStarClaimed={handleStarClaimed}
            instructionText="BRAVO! Prišel si do cilja. Sedaj klikni na sliko in ponovi besedo."
            autoPlayAudio={true}
          />
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col">
      {/* Background image layer */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />

      {/* Game content */}
      <div className="relative z-10 flex-1 overflow-hidden w-full h-full">
        <MazeGame key={gameKey} onComplete={handleGameComplete} cols={16} rows={9} alignTop />
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
            onClick={handleBack}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button
            onClick={handleNewGame}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              setShowInstructions(true);
            }}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
          >
            <span className="text-2xl">📖</span>
            <span>Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ali res želite prekiniti igro?</AlertDialogTitle>
            <AlertDialogDescription>
              Trenutna igra bo izgubljena.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Prekliči</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>
              Potrdi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="maze"
      />

      {completionImage && (
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={[completionImage]}
          onStarClaimed={handleStarClaimed}
          instructionText="BRAVO! Prišel si do cilja. Sedaj klikni na sliko in ponovi besedo."
          autoPlayAudio={true}
        />
      )}
    </div>
  );
};

export default LabirintX;
