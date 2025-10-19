import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";

const zImages = [
  { filename: 'zajec.png', word: 'ZAJEC' },
  { filename: 'zaslon.png', word: 'ZASLON' },
  { filename: 'zavesa.png', word: 'ZAVESA' },
  { filename: 'zebra.png', word: 'ZEBRA' },
  { filename: 'zlato.png', word: 'ZLATO' },
  { filename: 'zmaj.png', word: 'ZMAJ' },
  { filename: 'zob.png', word: 'ZOB' },
  { filename: 'zobotrebec.png', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.png', word: 'ZVEZDA' },
  { filename: 'zvocnik.png', word: 'ZVOČNIK' }
];

const getRandomZImage = () => {
  const randomIndex = Math.floor(Math.random() * zImages.length);
  return zImages[randomIndex];
};

export default function SestavljankeZ910() {
  return (
    <AgeGatedRoute requiredAgeGroup="9-10">
      <SestavljankeZ910Content />
    </AgeGatedRoute>
  );
}

function SestavljankeZ910Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomZImage());
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
    recordGameCompletion('puzzle', 'puzzle_z_20');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomZImage());
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/govorne-igre/sestavljanke");
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

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Sestavljanka Z</h2>
            <div className="flex justify-center gap-3">
              <Button onClick={handleBack} size="sm" variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              <Button onClick={handleNewGame} size="sm" className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button onClick={() => setShowInstructions(true)} size="sm" variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>
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
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={() => setShowInstructions(true)} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
        </div>
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