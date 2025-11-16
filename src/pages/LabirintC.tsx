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
import { ArrowLeft, RotateCcw, BookOpen } from "lucide-react";
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
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  return (
    <>
      {!effectiveFullscreen && (
        <AppLayout>
          <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <Header />
            
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-center gap-4 mb-6">
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

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <MazeGame key={gameKey} onComplete={handleGameComplete} />
                </CardContent>
              </Card>
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
        </AppLayout>
      )}

      {effectiveFullscreen && (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 bg-background/95 backdrop-blur-sm border-b">
            <MemoryExitConfirmationDialog onConfirm={confirmExit}>
              <Button size="sm" variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Nazaj
              </Button>
            </MemoryExitConfirmationDialog>
            
            <h1 className="text-xl font-bold text-foreground">Labirint - C</h1>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleNewGame}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Nova
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleInstructions}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center pt-16 px-4">
            <MazeGame key={gameKey} onComplete={handleGameComplete} />
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
      )}
    </>
  );
};

export default LabirintC;
