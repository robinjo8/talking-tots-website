import { AppLayout } from "@/components/AppLayout";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SestavljankeX() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const imageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png";
  
  const handleComplete = () => {
    console.log("Puzzle completed!");
  };

  const handleNewGame = () => {
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/govorne-igre/sestavljanke");
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        {!isMobile && (
          <div className="flex justify-center gap-4 p-4">
            <Button onClick={handleNewGame} variant="outline">
              Nova igra
            </Button>
            <Button onClick={handleInstructions} variant="outline">
              Navodila
            </Button>
            <Button onClick={handleBack} variant="outline">
              Nazaj
            </Button>
          </div>
        )}
        
        <div className="w-full flex justify-center items-center p-4">
          <SimpleJigsaw 
            key={puzzleKey}
            imageUrl={imageUrl}
            gridCols={3}
            gridRows={2}
            onComplete={handleComplete}
          />
        </div>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </div>
    </AppLayout>
  );
}