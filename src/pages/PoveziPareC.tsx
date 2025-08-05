import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { MatchingGame } from "@/components/matching/MatchingGame";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { getLetterData, getImagesForAgeGroup } from "@/data/matchingGameData";
import { useState, useRef } from "react";

export default function PoveziPareC() {
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const gameCompletedRef = useRef(false);
  
  const getGameImages = () => {
    const letterData = getLetterData('C');
    return letterData ? getImagesForAgeGroup(letterData.images, '3-4') : [];
  };
  
  const gameImages = getGameImages();

  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setGameKey(prev => prev + 1);
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          {/* Instruction speech-bubble */}
          <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
                <MessageSquare className="h-5 w-5 text-dragon-green" />
                HEJ, {childName?.toUpperCase() || "TIAN"}!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex items-center gap-4">
              <div className="hidden sm:block w-20 h-20">
                <img 
                  src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                  alt="Zmajček Tomi" 
                  className="w-full h-full object-contain animate-bounce-gentle"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium italic">POVEŽI SLIKE ZA ČRKO C!</p>
                <p className="text-sm text-muted-foreground mt-2">KLIKNI NA SLIKE, KI SODIJO SKUPAJ!</p>
              </div>
            </CardContent>
          </Card>

          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={handleNewGame} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            <Button onClick={handleInstructions} variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Navodila
            </Button>
          </div>

          <MatchingGame 
            key={gameKey}
            images={gameImages}
            numColumns={2}
            onGameComplete={handleGameComplete}
          />
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={gameImages}
        />
      </div>
    </AgeGatedRoute>
  );
}