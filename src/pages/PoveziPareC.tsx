import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { MatchingGame } from "@/components/matching/MatchingGame";
import { getLetterData, getImagesForAgeGroup } from "@/data/matchingGameData";
import { useState } from "react";
import { toast } from "sonner";

export default function PoveziPareC() {
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  
  const getGameImages = () => {
    const letterData = getLetterData('C');
    return letterData ? getImagesForAgeGroup(letterData.images, '3-4') : [];
  };
  
  const [gameItems, setGameItems] = useState(getGameImages);

  const handleGameComplete = (score: number) => {
    const maxScore = gameItems.length;
    toast.success(`Odlično! Dosegel si ${score} od ${maxScore} točk!`);
  };

  const startNewGame = () => {
    setGameItems(getGameImages());
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

          <MatchingGame 
            images={gameItems}
            numColumns={2}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    </AgeGatedRoute>
  );
}