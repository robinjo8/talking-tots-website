import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SestavljankeGames() {
  const navigate = useNavigate();
  const { profile, selectedChildIndex } = useAuth();
  
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childName = selectedChild?.name;

  const consonants = [
    { letter: "B", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "C", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Č", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "D", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "F", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "G", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "H", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "J", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "K", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "L", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "M", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "N", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "P", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "S", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Š", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "T", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "V", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "Z", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Ž", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
  ];

  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Tomi's instruction bubble */}
        <div className="mb-8 max-w-md mx-auto">
          <Alert className="bg-emerald-50 border-emerald-200 shadow-sm">
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-emerald-800 mb-1">
                Zmajček Tomi ti sporoča:
              </p>
              <p className="text-sm text-emerald-700 font-medium mb-2">
                Skupaj bova ujela vse črke – eno za drugo!
              </p>
              <p className="text-xs text-emerald-600">
                Z vajami postajamo vedno boljši!
              </p>
            </div>
          </Alert>
        </div>

        {/* Section 1: Izberi sestavljanko */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 mt-12">Izberi sestavljanko:</h2>
          <div className="flex justify-start">
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer hover:scale-105 w-24 h-24"
              onClick={handleRClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">R</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Section 2: Kmalu na voljo */}
        <div>
          <h2 className="text-2xl font-bold mb-6 mt-12">Kmalu na voljo:</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
            {consonants.map((consonant, index) => (
              <Card key={index} className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-full max-w-24 aspect-square">
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-3xl p-0 h-full flex items-center justify-center`}>
                  <CardTitle className="flex items-center justify-center">
                    <span className={`text-3xl font-bold ${consonant.color}`}>{consonant.letter}</span>
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