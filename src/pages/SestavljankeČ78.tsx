import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";

const čImages = [
  { filename: 'caj.png', word: 'ČAJ', audio: 'caj.m4a' },
  { filename: 'casopis.png', word: 'ČASOPIS', audio: 'casopis.m4a' },
  { filename: 'cebela.png', word: 'ČEBELA', audio: 'cebela.m4a' },
  { filename: 'cebula.png', word: 'ČEBULA', audio: 'cebula.m4a' },
  { filename: 'cesen.png', word: 'ČESEN', audio: 'cesen.m4a' },
  { filename: 'cevlji.png', word: 'ČEVLJI', audio: 'cevlji.m4a' },
  { filename: 'cokolada.png', word: 'ČOKOLADA', audio: 'cokolada.m4a' },
  { filename: 'coln.png', word: 'ČOLN', audio: 'coln.m4a' },
  { filename: 'copic.png', word: 'ČOPIČ', audio: 'copic.m4a' },
  { filename: 'crke.png', word: 'ČRKE', audio: 'crke.m4a' }
];

const getRandomČImage = () => {
  const randomIndex = Math.floor(Math.random() * čImages.length);
  return čImages[randomIndex];
};

export default function SestavljankeČ78() {
  return (
    <AgeGatedRoute requiredAgeGroup="7-8">
      <SestavljankeČ78Content />
    </AgeGatedRoute>
  );
}

function SestavljankeČ78Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomČImage());
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
    recordGameCompletion('puzzle', 'puzzle_č_16');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomČImage());
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
            <h2 className="text-lg font-bold mb-3 text-center">Sestavljanka Č</h2>
            <div className="flex justify-center gap-3">
              <Button onClick={handleNewGame} size="sm" className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button onClick={handleBack} size="sm" className="bg-black hover:bg-black/90 text-white gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              <Button onClick={() => setShowInstructions(true)} size="sm" className="bg-black hover:bg-black/90 text-white gap-2">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>
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
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <MatchingCompletionDialog 
          isOpen={showCompletion} 
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIČICO IN PONOVI BESEDO..."
        />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={() => setShowInstructions(true)} className="bg-black hover:bg-black/90 text-white gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
          <Button onClick={handleBack} className="bg-black hover:bg-black/90 text-white gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </div>
        <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={5}
            gridRows={5}
            onComplete={handleComplete}
          />
        </div>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <MatchingCompletionDialog 
          isOpen={showCompletion} 
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIČICO IN PONOVI BESEDO..."
        />
      </div>
    </AppLayout>
  );
}