import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { matchingGameData } from "@/data/matchingGameData";
import { getAgeGroup } from "@/utils/ageUtils";

export default function MatchingGames3to4() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;

  // Check if child is in correct age group
  const childAge = selectedChild?.age || 3;
  const ageGroup = getAgeGroup(childAge);

  if (ageGroup !== '3-4') {
    // Redirect to appropriate age group or show access denied
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Dostop omejen</h1>
            <p className="text-muted-foreground">
              Ta igra je namenjena otrokom starosti 3-4 leta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getGameColor = (letter: string) => {
    const index = matchingGameData.findIndex(data => data.letter === letter);
    const colors = [
      { color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
      { color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
      { color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
      { color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
    ];
    return colors[index % colors.length];
  };

  const GameCard = ({ letter, onClick }: { letter: string; onClick: () => void }) => {
    const colorScheme = getGameColor(letter);
    return (
      <Card
        className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r ${colorScheme.gradient} cursor-pointer hover:scale-105`}
        onClick={onClick}
      >
        <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
          <CardTitle className="flex items-center justify-center">
            <span className={`text-6xl font-bold ${colorScheme.color}`}>
              {letter}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-4 text-center">
          {/* No description text needed to match sestavljanke */}
        </CardContent>
      </Card>
    );
  };

  return (
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
              <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU POVEZATI PARE. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
              <p className="text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Izberi igro */}
        <div className="mb-12">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Back button */}
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r from-gray-100/50 to-gray-200/50 cursor-pointer hover:scale-105" 
              onClick={() => navigate('/govorne-igre')}
            >
              <CardHeader className="rounded-2xl flex-grow flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <img 
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/puscica_1.png" 
                    alt="Nazaj" 
                    className="h-16 w-16 object-contain"
                  />
                </CardTitle>
              </CardHeader>
            </Card>
            
            {matchingGameData.map(letterData => (
              <GameCard 
                key={letterData.letter}
                letter={letterData.letter}
                onClick={() => navigate(`/govorne-igre/povezi-pare-3-4/${letterData.letter.toLowerCase()}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}