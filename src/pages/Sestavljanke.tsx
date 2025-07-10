import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// All consonants (excluding vowels A, E, I, O, U)
const consonants = [
  { letter: "B", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
  { letter: "C", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "Č", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
  { letter: "D", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "F", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "G", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
  { letter: "H", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "J", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "K", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
  { letter: "L", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "M", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
  { letter: "N", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "P", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "S", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "Š", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
  { letter: "T", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
  { letter: "V", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
  { letter: "Z", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "Ž", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" }
];

export default function Sestavljanke() {
  const navigate = useNavigate();

  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Section 1: Active puzzles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Izberi sestavljanko:</h2>
          <div className="flex justify-start">
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer hover:scale-105 w-24 h-24"
              onClick={handleRClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-2xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">R</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Section 2: Coming soon */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Kmalu na voljo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {consonants.map((consonant) => (
              <Card 
                key={consonant.letter}
                className="transition-all duration-300 rounded-2xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24"
              >
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-2xl p-0 h-full flex items-center justify-center`}>
                  <CardTitle className="flex items-center justify-center">
                    <span className={`text-3xl font-bold ${consonant.color}`}>
                      {consonant.letter}
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}