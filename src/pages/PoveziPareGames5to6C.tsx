import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { ThreeColumnGame } from "@/components/matching/ThreeColumnGame";
import { getRandomThreeColumnItems } from "@/data/threeColumnMatchingData";
import { useState } from "react";

export default function PoveziPareGames5to6C() {
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const [gameItems, setGameItems] = useState(() => getRandomThreeColumnItems(4, 'c'));

  const handleGameComplete = (score: number) => {
    console.log(`Game completed with score: ${score}/4`);
    // Here you could save progress to database if needed
  };

  const startNewGame = () => {
    setGameItems(getRandomThreeColumnItems(4, 'c'));
  };

  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container max-w-7xl mx-auto pt-20 md:pt-24 pb-20 px-4">
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
                <p className="text-lg font-medium italic">POVEŽI ZVOK, SENCO IN SLIKO! TO JE ZAHTEVNEJŠA IGRA ZA TVOJO STAROST!</p>
                <p className="text-sm text-muted-foreground mt-2">IZBERI EN ZVOK, ENO SENCO IN ENO SLIKO, KI SE UJEMAJO!</p>
              </div>
            </CardContent>
          </Card>

          {/* Game */}
          <ThreeColumnGame 
            items={gameItems}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    </AgeGatedRoute>
  );
}