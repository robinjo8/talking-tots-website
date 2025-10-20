import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";

const žImages = [
  { filename: 'zaba.png', word: 'ŽABA' },
  { filename: 'zaga.png', word: 'ŽAGA' },
  { filename: 'zarnica.png', word: 'ŽARNICA' },
  { filename: 'zebelj.png', word: 'ŽEBELJ' },
  { filename: 'zelva.png', word: 'ŽELVA' },
  { filename: 'zerjav.png', word: 'ŽERJAV' },
  { filename: 'zirafa.png', word: 'ŽIRAFA' },
  { filename: 'zlica.png', word: 'ŽLICA' },
  { filename: 'zoga.png', word: 'ŽOGA' },
  { filename: 'zolna.png', word: 'ŽOLNA' }
];

const getRandomŽImage = () => {
  const randomIndex = Math.floor(Math.random() * žImages.length);
  return žImages[randomIndex];
};

export default function DrsnaSestavljankaŽ34() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <DrsnaSestavljankaŽ34Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljankaŽ34Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŽImage());
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

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomŽImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/govorne-igre/drsna-sestavljanka");
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', 'sliding_puzzle_ž_3-4');
  };

  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          // Lock screen orientation - simple approach
          try {
            if ('orientation' in screen && 'lock' in screen.orientation) {
              (screen.orientation as any).lock('portrait').catch(() => {
                console.log('Screen orientation lock not supported');
              });
            }
          } catch (error) {
            console.log('Screen orientation lock not available');
          }
        } catch (error) {
          console.log('Fullscreen or orientation lock not supported:', error);
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

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
            <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
              <h2 className="text-lg font-bold mb-3 text-center">Drsna sestavljanka Ž</h2>
              <div className="flex justify-center gap-3">
                <MemoryExitConfirmationDialog onConfirm={handleBack}>
                  <Button size="sm" variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Nazaj
                  </Button>
                </MemoryExitConfirmationDialog>
              
              <Button
                onClick={handleNewGame}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              
              <Button
                onClick={() => setShowInstructions(true)}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-muted/30 flex items-center justify-center p-4">
            <SlidingPuzzle34 
              key={puzzleKey}
              imageUrl={imageUrl}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>
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
      <div className="w-full min-h-screen bg-background">
          <div className="flex justify-center gap-4 p-4">
            <MemoryExitConfirmationDialog onConfirm={handleBack}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
            </MemoryExitConfirmationDialog>
          <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={() => setShowInstructions(true)} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
        </div>
        <div className="w-full bg-muted/30 flex justify-center items-center p-4 min-h-[calc(100vh-200px)]">
          <SlidingPuzzle34 
            key={puzzleKey}
            imageUrl={imageUrl}
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