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

const kImages = [
  { filename: 'kaca.png', word: 'KAČA' },
  { filename: 'kapa.png', word: 'KAPA' },
  { filename: 'kava.png', word: 'KAVA' },
  { filename: 'klavir.png', word: 'KLAVIR' },
  { filename: 'kljuc.png', word: 'KLJUČ' },
  { filename: 'klop.png', word: 'KLOP' },
  { filename: 'knjiga.png', word: 'KNJIGA' },
  { filename: 'kocka.png', word: 'KOCKA' },
  { filename: 'kokos.png', word: 'KOKOS' },
  { filename: 'kolo.png', word: 'KOLO' },
  { filename: 'kost.png', word: 'KOST' },
  { filename: 'kos.png', word: 'KOŠ' },
  { filename: 'kosara.png', word: 'KOŠARA' },
  { filename: 'koza.png', word: 'KOZA' },
  { filename: 'krava.png', word: 'KRAVA' },
  { filename: 'krof.png', word: 'KROF' },
  { filename: 'krog.png', word: 'KROG' },
  { filename: 'kruh.png', word: 'KRUH' },
  { filename: 'kumara.png', word: 'KUMARA' },
  { filename: 'kuza.png', word: 'KUŽA' }
];

const getRandomKImage = () => {
  const randomIndex = Math.floor(Math.random() * kImages.length);
  return kImages[randomIndex];
};

export default function SestavljankeK56() {
  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <SestavljankeK56Content />
    </AgeGatedRoute>
  );
}

function SestavljankeK56Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(getRandomKImage());
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  const effectiveFullscreen = isMobile;
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke/${currentImage.filename}`;
  
  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleStarClaimed = () => {
    recordGameCompletion('puzzle', 'puzzle_k_12');
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setCurrentImage(getRandomKImage());
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
            <h2 className="text-lg font-bold mb-3 text-center">Sestavljanka K</h2>
            <div className="flex justify-center gap-3">
              <Button onClick={handleNewGame} size="sm" className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              <Button variant="outline" onClick={handleBack} size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              <Button variant="outline" onClick={() => setShowInstructions(true)} size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <SimpleJigsaw 
              key={puzzleKey}
              imageUrl={imageUrl}
              gridCols={4}
              gridRows={3}
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
          instructionText="KLIKNI NA SPODNJO SLIČICO IN PONOVI BESEDO. ZA IZGOVORJAVO IMAŠ NA VOLJO 3 SEKUNDE ČASA. V KOLIKOR TI NE USPE, LAHKO PONOVIŠ Z GUMBOM 'PONOVI'."
        />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleNewGame} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={() => setShowInstructions(true)} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </div>
        <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={4}
            gridRows={3}
            onComplete={handleComplete}
          />
        </div>
        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
        <MatchingCompletionDialog 
          isOpen={showCompletion} 
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIČICO IN PONOVI BESEDO. ZA IZGOVORJAVO IMAŠ NA VOLJO 3 SEKUNDE ČASA. V KOLIKOR TI NE USPE, LAHKO PONOVIŠ Z GUMBOM 'PONOVI'."
        />
      </div>
    </AppLayout>
  );
}