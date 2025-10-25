import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const artikulacijaLetters = [
  {
    id: "vaje-r",
    letter: "R",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/artikulacija/r",
    available: true
  },
  {
    id: "vaje-l",
    letter: "L",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/artikulacija/l",
    available: true
  },
  {
    id: "vaje-k",
    letter: "K",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/artikulacija/k",
    available: true
  },
  {
    id: "vaje-c",
    letter: "C",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/artikulacija/c",
    available: true
  },
  {
    id: "vaje-č",
    letter: "Č",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/artikulacija/č",
    available: true
  },
  {
    id: "vaje-s",
    letter: "S",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/artikulacija/s",
    available: true
  },
  {
    id: "vaje-š",
    letter: "Š",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/artikulacija/š",
    available: true
  },
  {
    id: "vaje-z",
    letter: "Z",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/artikulacija/z",
    available: true
  },
  {
    id: "vaje-ž",
    letter: "Ž",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/artikulacija/ž",
    available: true
  }
];

export default function ArtikulacijaVaje() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;

  const handleLetterClick = (letter: typeof artikulacijaLetters[0]) => {
    if (!letter.available) return;
    navigate(letter.path);
  };

  const LetterCard = ({ letter }: { letter: typeof artikulacijaLetters[0] }) => (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r ${letter.gradient} ${letter.available ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'}`}
      onClick={() => handleLetterClick(letter)}
    >
      <CardHeader className="rounded-t-2xl pb-2 flex-grow flex items-center justify-center">
        <CardTitle className="flex items-center justify-center">
          <span className={`text-6xl font-bold ${letter.color}`}>
            {letter.letter}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 text-center">
        {!letter.available && (
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
              <p className="text-lg font-medium italic">IZBERI ČRKO IN VADIVA IZGOVORJAVO!</p>
              <p className="text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
            </div>
          </CardContent>
        </Card>

        {/* Letter Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Back button */}
          <Card 
            className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col bg-gradient-to-r from-gray-100/50 to-gray-200/50 cursor-pointer hover:scale-105" 
            onClick={() => navigate('/govorno-jezikovne-vaje')}
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
          
          {artikulacijaLetters.map(letter => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      </div>
    </div>
  );
}