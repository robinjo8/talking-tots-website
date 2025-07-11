import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
export default function SestavljankeGames() {
  const navigate = useNavigate();
  const {
    profile,
    selectedChildIndex
  } = useAuth();
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childName = selectedChild?.name;
  const consonants = [{
    letter: "B",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange"
  }, {
    letter: "C",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green"
  }, {
    letter: "Č",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue"
  }, {
    letter: "D",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple"
  }, {
    letter: "F",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange"
  }, {
    letter: "G",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green"
  }, {
    letter: "H",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue"
  }, {
    letter: "J",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple"
  }, {
    letter: "K",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange"
  }, {
    letter: "L",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green"
  }, {
    letter: "M",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue"
  }, {
    letter: "N",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple"
  }, {
    letter: "P",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange"
  }, {
    letter: "S",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green"
  }, {
    letter: "Š",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue"
  }, {
    letter: "T",
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple"
  }, {
    letter: "V",
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange"
  }, {
    letter: "Z",
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green"
  }, {
    letter: "Ž",
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue"
  }];
  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Instruction text */}
        <div className="mb-8">
          <p className="text-lg text-center text-foreground">
            Hej, {childName || "ime otroka"}! Izberi črko in pomagaj Tomiju sestaviti sliko. Na koncu pa skupaj glasno ponovita besedo!
          </p>
        </div>

        {/* Section 1: Izberi sestavljanko */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center ">Izberi sestavljanko</h2>
          <div className="flex justify-start">
            <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer hover:scale-105 w-24 h-24" onClick={handleRClick}>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center ">Kmalu na voljo</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
            {consonants.map((consonant, index) => <Card key={index} className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-full max-w-24 aspect-square">
                <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-3xl p-0 h-full flex items-center justify-center`}>
                  <CardTitle className="flex items-center justify-center">
                    <span className={`text-3xl font-bold ${consonant.color}`}>{consonant.letter}</span>
                  </CardTitle>
                </CardHeader>
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
}