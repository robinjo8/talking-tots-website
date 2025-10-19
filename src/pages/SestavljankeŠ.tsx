import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";

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

export default function SestavljankeŠ() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <SestavljankeŠContent />
    </AgeGatedRoute>
  );
}

function SestavljankeŠContent() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomŠImage());
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      recordGameCompletion('puzzle', 'puzzle_š_6');
      setShowCompletion(true);
    }
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
          console.log('Orientation unlock error:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Sestavljanka Š</h2>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleBack}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
              <Button
                onClick={handleNewGame}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              
              <Button
                onClick={handleInstructions}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>

          {/* Mobile Split Layout - Unified Puzzle */}
          <div className="flex-1 overflow-hidden">
            <SimpleJigsaw 
              key={puzzleKey}
              imageUrl={imageUrl}
              gridCols={3}
              gridRows={3}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
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
          <Button onClick={handleInstructions} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
        </div>
        
        <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={3}
            gridRows={3}
            onComplete={handleComplete}
          />
        </div>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
        />

      </div>
    </AppLayout>
  );
}