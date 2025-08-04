import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const memoryGames = [{
  id: "spomin-a",
  title: "Spomin - A",
  description: "Poišči pare slik s črko A",
  letter: "A",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-a",
  available: false
}, {
  id: "spomin-b",
  title: "Spomin - B",
  description: "Poišči pare slik s črko B",
  letter: "B",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-b",
  available: false
}, {
  id: "spomin-c",
  title: "Spomin - C",
  description: "Poišči pare slik s črko C",
  letter: "C",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-c",
  available: true
}, {
  id: "spomin-č",
  title: "Spomin - Č",
  description: "Poišči pare slik s črko Č",
  letter: "Č",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  path: "/govorne-igre/spomin/spomin-č",
  available: true
}, {
  id: "spomin-d",
  title: "Spomin - D",
  description: "Poišči pare slik s črko D",
  letter: "D",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-d",
  available: false
}, {
  id: "spomin-e",
  title: "Spomin - E",
  description: "Poišči pare slik s črko E",
  letter: "E",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-e",
  available: false
}, {
  id: "spomin-f",
  title: "Spomin - F",
  description: "Poišči pare slik s črko F",
  letter: "F",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-f",
  available: false
}, {
  id: "spomin-g",
  title: "Spomin - G",
  description: "Poišči pare slik s črko G",
  letter: "G",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  path: "/govorne-igre/spomin/spomin-g",
  available: false
}, {
  id: "spomin-h",
  title: "Spomin - H",
  description: "Poišči pare slik s črko H",
  letter: "H",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-h",
  available: false
}, {
  id: "spomin-i",
  title: "Spomin - I",
  description: "Poišči pare slik s črko I",
  letter: "I",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-i",
  available: false
}, {
  id: "spomin-j",
  title: "Spomin - J",
  description: "Poišči pare slik s črko J",
  letter: "J",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-j",
  available: false
}, {
  id: "spomin-k",
  title: "Spomin - K",
  description: "Poišči pare slik s črko K",
  letter: "K",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-k",
  available: true
}, {
  id: "spomin-l",
  title: "Spomin - L",
  description: "Poišči pare slik s črko L",
  letter: "L",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-l",
  available: true
}, {
  id: "spomin-m",
  title: "Spomin - M",
  description: "Poišči pare slik s črko M",
  letter: "M",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-m",
  available: false
}, {
  id: "spomin-n",
  title: "Spomin - N",
  description: "Poišči pare slik s črko N",
  letter: "N",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-n",
  available: false
}, {
  id: "spomin-o",
  title: "Spomin - O",
  description: "Poišči pare slik s črko O",
  letter: "O",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  path: "/govorne-igre/spomin/spomin-o",
  available: false
}, {
  id: "spomin-p",
  title: "Spomin - P",
  description: "Poišči pare slik s črko P",
  letter: "P",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-p",
  available: false
}, {
  id: "spomin-r",
  title: "Spomin - R",
  description: "Poišči pare slik s črko R",
  letter: "R",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-r",
  available: true
}, {
  id: "spomin-s",
  title: "Spomin - S",
  description: "Poišči pare slik s črko S",
  letter: "S",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-s",
  available: true
}, {
  id: "spomin-š",
  title: "Spomin - Š",
  description: "Poišči pare slik s črko Š",
  letter: "Š",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  path: "/govorne-igre/spomin/spomin-š",
  available: true
}, {
  id: "spomin-t",
  title: "Spomin - T",
  description: "Poišči pare slik s črko T",
  letter: "T",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-t",
  available: false
}, {
  id: "spomin-u",
  title: "Spomin - U",
  description: "Poišči pare slik s črko U",
  letter: "U",
  color: "text-dragon-green",
  gradient: "from-dragon-green/10 to-app-teal/10",
  path: "/govorne-igre/spomin/spomin-u",
  available: false
}, {
  id: "spomin-v",
  title: "Spomin - V",
  description: "Poišči pare slik s črko V",
  letter: "V",
  color: "text-app-blue",
  gradient: "from-app-blue/10 to-app-purple/10",
  path: "/govorne-igre/spomin/spomin-v",
  available: false
}, {
  id: "spomin-z",
  title: "Spomin - Z",
  description: "Poišči pare slik s črko Z",
  letter: "Z",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin/spomin-z",
  available: true
}, {
  id: "spomin-ž",
  title: "Spomin - Ž",
  description: "Poišči pare slik s črko Ž",
  letter: "Ž",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  path: "/govorne-igre/spomin/spomin-ž",
  available: true
}];
export default function SpominGames() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const activeGames = memoryGames.filter(game => game.available);
  const inactiveGames = memoryGames.filter(game => !game.available);
  const handleCardClick = (game: typeof memoryGames[0]) => {
    if (game.available) {
      navigate(game.path);
    }
  };
  const GameCard = ({
    game
  }: {
    game: typeof memoryGames[0];
  }) => <Card className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r ${game.gradient} ${game.available ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'}`} onClick={() => handleCardClick(game)}>
      <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
        <CardTitle className="flex items-center justify-center">
          <span className={`text-6xl font-bold ${game.color}`}>
            {game.letter}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 text-center">
        {!game.available && <p className="text-xs text-muted-foreground italic">
            Kmalu na voljo
          </p>}
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-background">
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
              <img src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" alt="Zmajček Tomi" className="w-full h-full object-contain animate-bounce-gentle" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium italic">IZBERI ČRKO IN POIŠČI PARE SLIK TER NATO PONOVI BESEDO!</p>
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
              <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <img 
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/puscica_1.png" 
                    alt="Nazaj" 
                    className="h-12 w-12 object-contain"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-4 text-center">
                <p className="text-xs text-muted-foreground font-medium">
                  NAZAJ
                </p>
              </CardContent>
            </Card>
            
            {activeGames.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </div>

        {/* Section 2: Kmalu na voljo */}
        
      </div>
    </div>;
}