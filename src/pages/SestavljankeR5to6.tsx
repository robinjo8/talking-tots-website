import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const rImages = [
  { filename: "raca.png", word: "raca" },
  { filename: "rak.png", word: "rak" },
  { filename: "ribica.png", word: "ribica" },
  { filename: "robot.png", word: "robot" },
  { filename: "roze.png", word: "roze" },
  { filename: "ruka.png", word: "ruka" },
  { filename: "raca.png", word: "raca" },
  { filename: "rak.png", word: "rak" },
  { filename: "ribica.png", word: "ribica" },
  { filename: "robot.png", word: "robot" },
  { filename: "roze.png", word: "roze" },
  { filename: "ruka.png", word: "ruka" },
];

const getRandomRImage = () => {
  const randomIndex = Math.floor(Math.random() * rImages.length);
  return rImages[randomIndex];
};

export default function SestavljankeR5to6() {
  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <SestavljankeR5to6Content />
    </AgeGatedRoute>
  );
}

function SestavljankeR5to6Content() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [currentImage, setCurrentImage] = useState(() => getRandomRImage());
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      document.documentElement.requestFullscreen?.();
      
      if ('orientation' in screen && 'lock' in screen.orientation) {
        (screen.orientation as any).lock('portrait').catch(console.log);
      }
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [isMobile]);

  const handlePuzzleComplete = () => {
    setShowCompletion(true);
  };

  const handleNewGame = () => {
    setCurrentImage(getRandomRImage());
    setPuzzleKey(prev => prev + 1);
    setShowCompletion(false);
  };

  const handleBack = () => {
    navigate('/govorne-igre/sestavljanke');
  };

  if (isMobile && document.fullscreenElement) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col relative overflow-hidden">
        <div className="flex-1 p-2">
          <SimpleJigsaw
            key={puzzleKey}
            imageUrl={`/lovable-uploads/${currentImage.filename}`}
            gridCols={4}
            gridRows={3}
            onComplete={handlePuzzleComplete}
            className="h-full w-full"
          />
        </div>
        
        <div className="flex justify-center gap-2 p-2 bg-background/80 backdrop-blur-sm">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Nazaj
          </Button>
          <Button
            onClick={handleNewGame}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button
            onClick={() => setShowInstructions(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            Navodila
          </Button>
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Nazaj
            </Button>
            <h1 className="text-2xl font-bold">Sestavljanka R - 12 kosov</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleNewGame}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            <Button
              onClick={() => setShowInstructions(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Navodila
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg text-muted-foreground">
            Sestavi pravilno sliko in se naučit izgovarjati črko R!
          </p>
        </div>

        <SimpleJigsaw
          key={puzzleKey}
          imageUrl={`/lovable-uploads/${currentImage.filename}`}
          gridCols={4}
          gridRows={3}
          onComplete={handlePuzzleComplete}
          className="max-w-4xl mx-auto"
        />

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