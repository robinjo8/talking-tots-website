import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { AgeSelectionDialog } from "@/components/free-games/AgeSelectionDialog";
import { FreeGamesList } from "@/components/free-games/FreeGamesList";

export default function BrezplacneIgre() {
  const navigate = useNavigate();
  const { childAge, setChildAge, remainingGames, setFreeGameMode, resetSessionRecording } = useFreeGameContext();
  const [showAgeDialog, setShowAgeDialog] = useState(false);

  useEffect(() => {
    // Enter free game mode
    setFreeGameMode(true);
    resetSessionRecording();
    
    // Show age dialog if no age is set
    if (childAge === null) {
      setShowAgeDialog(true);
    }

    return () => {
      // Exit free game mode when leaving
      setFreeGameMode(false);
    };
  }, [childAge, setFreeGameMode, resetSessionRecording]);

  const handleAgeSelected = (age: number) => {
    setChildAge(age);
    setShowAgeDialog(false);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-dragon-green/10 to-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-dragon-green">BREZPLAČNE IGRE</h1>
              <p className="text-sm text-muted-foreground">
                Preostale igre danes: <span className="font-bold text-dragon-green">{remainingGames}/3</span>
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAgeDialog(true)}
              className="text-sm"
            >
              Starost: {childAge || "?"}
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="max-w-7xl mx-auto py-6">
          <FreeGamesList />
        </div>

        {/* Age Selection Dialog */}
        <AgeSelectionDialog
          open={showAgeDialog}
          onAgeSelected={handleAgeSelected}
          onClose={() => setShowAgeDialog(false)}
          hasExistingAge={childAge !== null}
        />
      </div>
    </AppLayout>
  );
}
