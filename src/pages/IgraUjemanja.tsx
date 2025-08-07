import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";

const matchingGames = [{
  id: "igra-ujemanja-c",
  title: "Igra Ujemanja - C",
  description: "Povežite besedo s črko C s pravo sliko",
  letter: "C",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  available: true
}, {
  id: "igra-ujemanja-r",
  title: "Igra Ujemanja - R",
  description: "Povežite besedo s črko R s pravo sliko",
  letter: "R",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  available: true
}, {
  id: "igra-ujemanja-l",
  title: "Igra Ujemanja - L",
  description: "Povežite besedo s črko L s pravo sliko",
  letter: "L",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-amber-300/10",
  available: true
}, {
  id: "igra-ujemanja-k",
  title: "Igra Ujemanja - K",
  description: "Povežite besedo s črko K s pravo sliko",
  letter: "K",
  color: "text-blue-600",
  gradient: "from-blue-600/10 to-cyan-400/10",
  available: true
}, {
  id: "igra-ujemanja-č",
  title: "Igra Ujemanja - Č",
  description: "Povežite besedo s črko Č s pravo sliko",
  letter: "Č",
  color: "text-red-600",
  gradient: "from-red-600/10 to-pink-400/10",
  available: true
}, {
  id: "igra-ujemanja-s",
  title: "Igra Ujemanja - S",
  description: "Povežite besedo s črko S s pravo sliko",
  letter: "S",
  color: "text-green-600",
  gradient: "from-green-600/10 to-emerald-400/10",
  available: true
}, {
  id: "igra-ujemanja-š",
  title: "Igra Ujemanja - Š",
  description: "Povežite besedo s črko Š s pravo sliko",
  letter: "Š",
  color: "text-indigo-600",
  gradient: "from-indigo-600/10 to-purple-400/10",
  available: true
}, {
  id: "igra-ujemanja-z",
  title: "Igra Ujemanja - Z",
  description: "Povežite besedo s črko Z s pravo sliko",
  letter: "Z",
  color: "text-yellow-600",
  gradient: "from-yellow-600/10 to-orange-400/10",
  available: true
}, {
  id: "igra-ujemanja-ž",
  title: "Igra Ujemanja - Ž",
  description: "Povežite besedo s črko Ž s pravo sliko",
  letter: "Ž",
  color: "text-pink-600",
  gradient: "from-pink-600/10 to-rose-400/10",
  available: true
}];

export default function IgraUjemanja() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const activeGames = matchingGames.filter(game => game.available);

  const handleCardClick = (game: typeof matchingGames[0]) => {
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
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}`;
        break;
      case '5-6':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}56`;
        break;
      case '7-8':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}78`;
        break;
      case '9-10':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}910`;
        break;
      default:
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}`;
    }
    
    navigate(targetRoute);
  };

  const GameCard = ({ game }: { game: typeof matchingGames[0] }) => (
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
              <p className="text-lg font-medium italic">IZBERI ČRKO IN POVEŽI BESEDE S ČRKO S PRAVIMI SLIKAMI!</p>
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