import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Header from "@/components/Header";
import { MazeGame } from "@/components/games/MazeGame";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft, RotateCcw, BookOpen, Home } from "lucide-react";
import { matchingGameData } from "@/data/matchingGameData";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const LabirintC = () => {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <LabirintCContent />
    </AgeGatedRoute>
  );
};

const LabirintCContent = () => {
  const navigate = useNavigate();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { recordGameCompletion } = useEnhancedProgress();
  const isMobile = useIsMobile();
  const { user, selectedChild } = useAuth();
  const gameCompletedRef = useRef(false);
  
  const effectiveFullscreen = isMobile;

  const completionImage = useMemo(() => {
    const letterData = matchingGameData.find(data => data.letter === "C");
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
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const confirmExit = () => {
    navigate('/govorne-igre');
  };

  const handleStarClaimed = async () => {
    await recordGameCompletion('memory_game', 'labirint-c');
    setShowCompletion(false);
  };

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
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="flex-1 flex items-stretch justify-center overflow-hidden h-full">
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

        {/* Floating home button */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-4 left-4 z-50 bg-app-orange hover:bg-app-orange/90 text-white shadow-lg rounded-full w-14 h-14"
            >
              <Home className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col gap-3 p-6">
              <MemoryExitConfirmationDialog onConfirm={confirmExit}>
                <Button variant="outline" className="gap-2 w-full h-12 text-base">
                  <ArrowLeft className="w-5 h-5" />
                  Nazaj
                </Button>
              </MemoryExitConfirmationDialog>
              
              <Button
                onClick={() => {
                  handleNewGame();
                  setDrawerOpen(false);
                }}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-12 text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Nova igra
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  handleInstructions();
                  setDrawerOpen(false);
                }}
                className="gap-2 w-full h-12 text-base"
              >
                <BookOpen className="w-5 h-5" />
                Navodila
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

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

  // Desktop version - landscape full screen
  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Labirint - C
        </h1>
        <div className="flex items-center justify-center gap-3">
          <MemoryExitConfirmationDialog onConfirm={confirmExit}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
          </MemoryExitConfirmationDialog>
          
          <Button
            onClick={handleNewGame}
            className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          
          <Button
            variant="outline"
            onClick={handleInstructions}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center w-full p-0">
        <MazeGame key={gameKey} onComplete={handleGameComplete} cols={16} rows={9} />
      </div>

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

export default LabirintC;
