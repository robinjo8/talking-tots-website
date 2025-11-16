import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Header from "@/components/Header";
import { MazeGame } from "@/components/games/MazeGame";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, HelpCircle } from "lucide-react";
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
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { recordGameCompletion } = useEnhancedProgress();
  const isMobile = useIsMobile();
  const { user, selectedChild } = useAuth();
  const gameCompletedRef = useRef(false);
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;

  // Get random image for completion - changes only on new game
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

  const handleBack = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate('/govorne-igre');
  };

  const handleStarClaimed = async () => {
    await recordGameCompletion('memory_game', 'labirint-c');
    setShowCompletion(false);
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
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  // Desktop layout with AppLayout
  if (!effectiveFullscreen) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          <Header />
          
          <main className="container mx-auto px-4 py-8 pt-24">
            <div className="max-w-4xl mx-auto">
              {/* Control buttons */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Nazaj
                </Button>

                <h1 className="text-3xl font-bold text-center">
                  Labirint - Črka C
                </h1>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNewGame}
                    className="gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Nova igra
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleInstructions}
                    className="gap-2"
                  >
                    <HelpCircle className="w-5 h-5" />
                    Navodila
                  </Button>
                </div>
              </div>

              {/* Game */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <MazeGame key={gameKey} onComplete={handleGameComplete} />
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Instructions Modal */}
          <InstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
            type="maze"
          />

          {/* Completion Dialog */}
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

          {/* Exit Confirmation */}
          <ConfirmDialog
            open={showExitDialog}
            onOpenChange={setShowExitDialog}
            title="Opozorilo"
            description="Ali res želite prekiniti igro?"
            confirmText="Da"
            cancelText="Ne"
            onConfirm={confirmExit}
          />
        </div>
      </AppLayout>
    );
  }

  // Mobile fullscreen layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      {/* Control buttons - Fixed at top */}
      <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazaj
        </Button>

        <h1 className="text-lg font-bold">
          Labirint - C
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewGame}
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Nova
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstructions}
            className="gap-1"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game */}
      <div className="flex-1 flex items-center justify-center p-4">
        <MazeGame key={gameKey} onComplete={handleGameComplete} />
      </div>

      {/* Completion Dialog */}
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

      {/* Exit Confirmation */}
      <ConfirmDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        title="Opozorilo"
        description="Ali res želite prekiniti igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={confirmExit}
      />
    </div>
  );
};

export default LabirintC;
