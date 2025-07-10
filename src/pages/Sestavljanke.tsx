import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Slovenian vowels for the "Kmalu na voljo" section
const vowels = [
  { letter: "A", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" },
  { letter: "E", color: "text-dragon-green", gradient: "from-dragon-green/10 to-app-teal/10" },
  { letter: "I", color: "text-app-blue", gradient: "from-app-blue/10 to-app-purple/10" },
  { letter: "O", color: "text-app-purple", gradient: "from-app-purple/10 to-app-blue/10" },
  { letter: "U", color: "text-app-orange", gradient: "from-app-orange/10 to-app-yellow/10" }
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
        {/* Section 1: Active puzzle - Letter R */}
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

        {/* Section 2: Coming soon vowels */}
        <div>
          <h2 className="text-2xl font-bold mb-6 mt-12">Kmalu na voljo:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {vowels.map((vowel) => (
              <Card 
                key={vowel.letter}
                className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24"
              >
                <CardHeader className={`bg-gradient-to-r ${vowel.gradient} rounded-3xl p-0 h-full flex items-center justify-center`}>
                  <CardTitle className="flex items-center justify-center">
                    <span className={`text-3xl font-bold ${vowel.color}`}>
                      {vowel.letter}
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