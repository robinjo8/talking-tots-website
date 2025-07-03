
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleLetterClick = (letter: string, available: boolean) => {
    if (available) {
      navigate(`/video-navodila/crka-${letter.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Video navodila" backPath="/moja-stran" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Oglejte si video navodila za pravilno izgovorjavo soglasnikov.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {consonants.map((consonant) => (
            <Card 
              key={consonant.letter}
              className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col ${
                consonant.available 
                  ? 'cursor-pointer hover:scale-105' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleLetterClick(consonant.letter, consonant.available)}
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
                <h3 className={`text-lg font-semibold mb-2 ${consonant.color}`}>
                  Črka {consonant.letter}
                </h3>
                <p className="text-sm text-gray-600">
                  Video navodila za izgovorjavo črke {consonant.letter}
                </p>
                {!consonant.available && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Kmalu na voljo
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoNavodila;
