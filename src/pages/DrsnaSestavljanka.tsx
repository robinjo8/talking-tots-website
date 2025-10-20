import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";

const memoryGames = [{
  id: "drsna-sestavljanka-c",
  title: "Drsna sestavljanka - C",
  description: "Drsna sestavljanka s črko C in nato glasno ponovi besedo",
  letter: "C",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  available: true
}, {
  id: "drsna-sestavljanka-č",
  title: "Drsna sestavljanka - Č",
  description: "Drsna sestavljanka s črko Č in nato glasno ponovi besedo",
  letter: "Č",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  available: true
}, {
  id: "drsna-sestavljanka-k",
  title: "Drsna sestavljanka - K",
  description: "Drsna sestavljanka s črko K in nato glasno ponovi besedo",
  letter: "K",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  available: true
}, {
  id: "drsna-sestavljanka-l",
  title: "Drsna sestavljanka - L",
  description: "Drsna sestavljanka s črko L in nato glasno ponovi besedo",
  letter: "L",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  available: true
}, {
  id: "drsna-sestavljanka-r",
  title: "Drsna sestavljanka - R",
  description: "Drsna sestavljanka s črko R in nato glasno ponovi besedo",
  letter: "R",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  available: true
}, {
  id: "drsna-sestavljanka-s",
  title: "Drsna sestavljanka - S",
  description: "Drsna sestavljanka s črko S in nato glasno ponovi besedo",
  letter: "S",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  available: true
}, {
  id: "drsna-sestavljanka-š",
  title: "Drsna sestavljanka - Š",
  description: "Drsna sestavljanka s črko Š in nato glasno ponovi besedo",
  letter: "Š",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  available: true
}, {
  id: "drsna-sestavljanka-z",
  title: "Drsna sestavljanka - Z",
  description: "Drsna sestavljanka s črko Z in nato glasno ponovi besedo",
  letter: "Z",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  available: true
}, {
  id: "drsna-sestavljanka-ž",
  title: "Drsna sestavljanka - Ž",
  description: "Drsna sestavljanka s črko Ž in nato glasno ponovi besedo",
  letter: "Ž",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  available: true
}];

export default function DrsnaSestavljanka() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const activeGames = memoryGames.filter(game => game.available);

  const handleCardClick = (game: typeof memoryGames[0]) => {
    if (!game.available) return;
    
    if (!selectedChild?.age) {
      navigate('/profile');
      return;
    }
    
    const childAge = selectedChild.age;
    const ageGroup = getAgeGroup(childAge);
    
    let targetRoute = '';
    switch (ageGroup) {
      case '3-4':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}`;
        break;
      case '5-6':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}56`;
        break;
      case '7-8':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}78`;
        break;
      case '9-10':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}910`;
        break;
      default:
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}`;
    }
    
    navigate(targetRoute);
  };

  const GameCard = ({ game }: { game: typeof memoryGames[0] }) => (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r ${game.gradient} ${game.available ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'}`} 
      onClick={() => handleCardClick(game)}
    >
      <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
        <CardTitle className="flex items-center justify-center">
          <span className={`text-6xl font-bold ${game.color}`}>
            {game.letter}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 text-center">
        {!game.available && (
          <p className="text-xs text-muted-foreground italic">
            Kmalu na voljo
          </p>
        )}
      </CardContent>
    </Card>
  );

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
              <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU SESTAVITI DRSNO SESTAVLJANKO. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
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
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/puscica_1.png" 
                    alt="Nazaj" 
                    className="h-16 w-16 object-contain"
                  />
                </CardTitle>
              </CardHeader>
            </Card>
            
            {activeGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}