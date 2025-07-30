import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
export default function SestavljankeGames() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    selectedChild
  } = useAuth();
  const childName = selectedChild?.name;
const consonants = [
  {
    letter: "B",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    description: "Sestavi sliko s črko B in nato glasno ponovi besedo"
  },
  {
    letter: "C",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    description: "Sestavi sliko s črko C in nato glasno ponovi besedo"
  },
  {
    letter: "Č",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    description: "Sestavi sliko s črko Č in nato glasno ponovi besedo"
  },
  {
    letter: "D",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple",
    description: "Sestavi sliko s črko D in nato glasno ponovi besedo"
  },
  {
    letter: "F",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    description: "Sestavi sliko s črko F in nato glasno ponovi besedo"
  },
  {
    letter: "G",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    description: "Sestavi sliko s črko G in nato glasno ponovi besedo"
  },
  {
    letter: "H",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    description: "Sestavi sliko s črko H in nato glasno ponovi besedo"
  },
  {
    letter: "J",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple",
    description: "Sestavi sliko s črko J in nato glasno ponovi besedo"
  },
  {
    letter: "K",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    description: "Sestavi sliko s črko K in nato glasno ponovi besedo"
  },
  {
    letter: "L",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    description: "Sestavi sliko s črko L in nato glasno ponovi besedo"
  },
  {
    letter: "M",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    description: "Sestavi sliko s črko M in nato glasno ponovi besedo"
  },
  {
    letter: "N",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple",
    description: "Sestavi sliko s črko N in nato glasno ponovi besedo"
  },
  {
    letter: "P",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    description: "Sestavi sliko s črko P in nato glasno ponovi besedo"
  },
  {
    letter: "S",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    description: "Sestavi sliko s črko S in nato glasno ponovi besedo"
  },
  {
    letter: "Š",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    description: "Sestavi sliko s črko Š in nato glasno ponovi besedo"
  },
  {
    letter: "T",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple",
    description: "Sestavi sliko s črko T in nato glasno ponovi besedo"
  },
  {
    letter: "V",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    description: "Sestavi sliko s črko V in nato glasno ponovi besedo"
  },
  {
    letter: "Z",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    description: "Sestavi sliko s črko Z in nato glasno ponovi besedo"
  },
  {
    letter: "Ž",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    description: "Sestavi sliko s črko Ž in nato glasno ponovi besedo"
  }
];
  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };

  const handleTestClick = async () => {
    if (isMobile) {
      try {
        // Request fullscreen immediately
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
        
        // Lock orientation to landscape
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape');
        }
      } catch (error) {
        console.log('Fullscreen/orientation setup failed:', error);
      }
    }
    
    navigate("/govorne-igre/sestavljanke/test");
  };
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
              <img 
                src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                alt="Zmajček Tomi" 
                className="w-full h-full object-contain animate-bounce-gentle"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU SESTAVITI SLIKO. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
              <p className="text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Izberi sestavljanko */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">
            Izberi sestavljanko
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col cursor-pointer hover:scale-105"
              onClick={handleRClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-t-2xl pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <span className="text-2xl font-bold text-app-purple">
                      R
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <p className="text-sm font-semibold mb-2 text-app-purple">
                  Sestavi sliko s črko R in nato glasno ponovi besedo
                </p>
              </CardContent>
            </Card>

            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col cursor-pointer hover:scale-105"
              onClick={handleTestClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <span className="text-2xl font-bold text-app-orange">
                      TEST
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <p className="text-sm font-semibold mb-2 text-app-orange">
                  Preizkusi novo sestavljanko z Zmajčkom Tomijem
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: Kmalu na voljo */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-muted-foreground">
            Kmalu na voljo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {consonants.map((consonant, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col opacity-60 cursor-not-allowed"
              >
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-t-2xl pb-4`}>
                  <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                      <span className={`text-2xl font-bold ${consonant.color}`}>
                        {consonant.letter}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4 flex-grow text-center">
                  <p className={`text-sm font-semibold mb-2 ${consonant.color}`}>
                    {consonant.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Kmalu na voljo
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>;
}