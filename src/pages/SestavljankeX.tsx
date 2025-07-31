import { AppLayout } from "@/components/AppLayout";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";

export default function SestavljankeX() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
  
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

  // Enable fullscreen on mobile devices only
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
      <div className="fixed inset-0 bg-background overflow-hidden" style={{ transform: 'rotate(0deg)' }}>
        <div className="h-full flex flex-col">
          <Card className="bg-dragon-green/5 mx-2 mt-2 mb-1 flex-shrink-0">
            <CardContent className="p-3">
              <div className="space-y-3">
                <div>
                  <h2 className="text-base font-bold mb-2">Sestavljanka X</h2>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">
                      <span className="font-medium">Sestavljaj sliko zmajčka</span>
                    </div>
                    
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        onClick={handleNewGame}
                        size="sm"
                        className="bg-dragon-green hover:bg-dragon-green/90 text-white p-1.5 h-8 w-8"
                        variant="default"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        size="sm"
                        className="p-1.5 h-8 w-8"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleInstructions}
                        size="sm"
                        className="p-1.5 h-8 w-8"
                      >
                        <BookOpen className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 px-2 pb-2 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <SimpleJigsaw 
                key={puzzleKey}
                imageUrl={imageUrl}
                gridCols={3}
                gridRows={2}
                onComplete={handleComplete}
              />
            </div>
          </div>
        </div>

        <InstructionsModal 
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
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
          <Button onClick={handleInstructions} variant="outline" className="gap-2">
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