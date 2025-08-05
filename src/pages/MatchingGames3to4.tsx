import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { matchingGameData } from "@/data/matchingGameData";
import { getAgeGroup } from "@/utils/ageUtils";
import Header from "@/components/Header";

export default function MatchingGames3to4() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();

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

  const GameCard = ({ letter, onClick }: { letter: string; onClick: () => void }) => (
    <Card
      className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r from-app-purple/10 to-app-blue/10 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
        <CardTitle className="text-6xl md:text-8xl font-bold text-app-purple">
          {letter}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 text-center">
        <p className="text-xs md:text-sm text-muted-foreground font-medium">
          ČRKA {letter}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Header with speech bubble */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-app-purple to-app-blue flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            <p className="text-sm md:text-base font-medium text-gray-700">
              {selectedChild?.name ? `Pozdravljeni ${selectedChild.name}! ` : 'Pozdravljeni! '}
              Izberite črko za igranje igre povezovanja parov!
            </p>
          </div>
        </div>

        {/* Back button */}
        <div className="mb-6">
          <Card
            className="w-fit transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r from-gray-100/50 to-gray-200/50 cursor-pointer hover:scale-105" 
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
        </div>

        {/* Available Games */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
  );
}