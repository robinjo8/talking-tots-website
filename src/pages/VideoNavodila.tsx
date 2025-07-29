
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Slovenian consonants only
const consonants = [
  { letter: "B", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10", available: false },
  { letter: "C", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10", available: false },
  { letter: "Č", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10", available: false },
  { letter: "D", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: false },
  { letter: "F", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10", available: false },
  { letter: "G", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10", available: false },
  { letter: "H", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: false },
  { letter: "J", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10", available: false },
  { letter: "K", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10", available: false },
  { letter: "L", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: false },
  { letter: "M", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10", available: false },
  { letter: "N", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10", available: false },
  { letter: "P", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: false },
  { letter: "R", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: true },
  { letter: "S", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10", available: false },
  { letter: "Š", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10", available: false },
  { letter: "T", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10", available: false },
  { letter: "V", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10", available: false },
  { letter: "Z", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10", available: false },
  { letter: "Ž", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10", available: false },
];

const VideoNavodila = () => {
  const navigate = useNavigate();
  const {
    selectedChild
  } = useAuth();
  const childName = selectedChild?.name;

  const handleLetterClick = (letter: string, available: boolean) => {
    if (available) {
      navigate(`/video-navodila/crka-${letter.toLowerCase()}`);
    }
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
          <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <img 
                src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                alt="Zmajček Tomi" 
                className="w-full h-full object-contain animate-bounce-gentle"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-medium italic leading-relaxed">NA TEJ STRANI SI LAHKO IZBERETE ČRKO, KI VAS ZANIMA – PRIKAZAL SE BO VIDEO Z NAVODILI ZA PRAVILNO IZGOVORJAVO TE ČRKE.</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
            </div>
          </CardContent>
        </Card>

        {/* Available letter section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-primary">
            Izberi črko
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {consonants.filter(c => c.available).map((consonant) => (
              <Card 
                key={consonant.letter}
                className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col cursor-pointer hover:scale-105"
                onClick={() => handleLetterClick(consonant.letter, consonant.available)}
              >
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-t-2xl pb-3 sm:pb-4`}>
                  <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-200">
                      <span className={`text-xl sm:text-2xl font-bold ${consonant.color}`}>
                        {consonant.letter}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-4 flex-grow text-center px-4">
                  <p className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${consonant.color} leading-tight`}>
                    Video navodila za črko {consonant.letter}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Unavailable letters section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-muted-foreground">
            Kmalu na voljo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {consonants.filter(c => !c.available).map((consonant) => (
              <Card 
                key={consonant.letter}
                className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col opacity-60 cursor-not-allowed"
              >
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-t-2xl pb-3 sm:pb-4`}>
                  <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-200">
                      <span className={`text-xl sm:text-2xl font-bold ${consonant.color}`}>
                        {consonant.letter}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-4 flex-grow text-center px-4">
                  <p className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${consonant.color} leading-tight`}>
                    Video navodila za črko {consonant.letter}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 sm:mt-2 italic">
                    Kmalu na voljo
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoNavodila;
