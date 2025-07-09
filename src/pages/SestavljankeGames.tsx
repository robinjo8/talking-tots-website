import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const puzzleGames = [
  {
    id: "sestavljanke-a",
    title: "Sestavljanke - A",
    description: "Reši sestavljanke s črko A",
    letter: "A",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/a",
    available: false
  },
  {
    id: "sestavljanke-b",
    title: "Sestavljanke - B",
    description: "Reši sestavljanke s črko B",
    letter: "B",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/b",
    available: false
  },
  {
    id: "sestavljanke-c",
    title: "Sestavljanke - C",
    description: "Reši sestavljanke s črko C",
    letter: "C",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/c",
    available: false
  },
  {
    id: "sestavljanke-č",
    title: "Sestavljanke - Č",
    description: "Reši sestavljanke s črko Č",
    letter: "Č",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/sestavljanke/č",
    available: false
  },
  {
    id: "sestavljanke-d",
    title: "Sestavljanke - D",
    description: "Reši sestavljanke s črko D",
    letter: "D",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/d",
    available: false
  },
  {
    id: "sestavljanke-e",
    title: "Sestavljanke - E",
    description: "Reši sestavljanke s črko E",
    letter: "E",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/e",
    available: false
  },
  {
    id: "sestavljanke-f",
    title: "Sestavljanke - F",
    description: "Reši sestavljanke s črko F",
    letter: "F",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/f",
    available: false
  },
  {
    id: "sestavljanke-g",
    title: "Sestavljanke - G",
    description: "Reši sestavljanke s črko G",
    letter: "G",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/sestavljanke/g",
    available: false
  },
  {
    id: "sestavljanke-h",
    title: "Sestavljanke - H",
    description: "Reši sestavljanke s črko H",
    letter: "H",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/h",
    available: false
  },
  {
    id: "sestavljanke-i",
    title: "Sestavljanke - I",
    description: "Reši sestavljanke s črko I",
    letter: "I",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/i",
    available: false
  },
  {
    id: "sestavljanke-j",
    title: "Sestavljanke - J",
    description: "Reši sestavljanke s črko J",
    letter: "J",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/j",
    available: false
  },
  {
    id: "sestavljanke-k",
    title: "Sestavljanke - K",
    description: "Reši sestavljanke s črko K",
    letter: "K",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/k",
    available: false
  },
  {
    id: "sestavljanke-l",
    title: "Sestavljanke - L",
    description: "Reši sestavljanke s črko L",
    letter: "L",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/l",
    available: false
  },
  {
    id: "sestavljanke-m",
    title: "Sestavljanke - M",
    description: "Reši sestavljanke s črko M",
    letter: "M",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/m",
    available: false
  },
  {
    id: "sestavljanke-n",
    title: "Sestavljanke - N",
    description: "Reši sestavljanke s črko N",
    letter: "N",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/n",
    available: false
  },
  {
    id: "sestavljanke-o",
    title: "Sestavljanke - O",
    description: "Reši sestavljanke s črko O",
    letter: "O",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/sestavljanke/o",
    available: false
  },
  {
    id: "sestavljanke-p",
    title: "Sestavljanke - P",
    description: "Reši sestavljanke s črko P",
    letter: "P",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/p",
    available: false
  },
  {
    id: "sestavljanke-r",
    title: "Sestavljanke - R",
    description: "Reši sestavljanke s črko R",
    letter: "R",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/r",
    available: true
  },
  {
    id: "sestavljanke-s",
    title: "Sestavljanke - S",
    description: "Reši sestavljanke s črko S",
    letter: "S",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/s",
    available: false
  },
  {
    id: "sestavljanke-š",
    title: "Sestavljanke - Š",
    description: "Reši sestavljanke s črko Š",
    letter: "Š",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/sestavljanke/š",
    available: false
  },
  {
    id: "sestavljanke-t",
    title: "Sestavljanke - T",
    description: "Reši sestavljanke s črko T",
    letter: "T",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/t",
    available: false
  },
  {
    id: "sestavljanke-u",
    title: "Sestavljanke - U",
    description: "Reši sestavljanke s črko U",
    letter: "U",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/sestavljanke/u",
    available: false
  },
  {
    id: "sestavljanke-v",
    title: "Sestavljanke - V",
    description: "Reši sestavljanke s črko V",
    letter: "V",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/sestavljanke/v",
    available: false
  },
  {
    id: "sestavljanke-z",
    title: "Sestavljanke - Z",
    description: "Reši sestavljanke s črko Z",
    letter: "Z",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/sestavljanke/z",
    available: false
  },
  {
    id: "sestavljanke-ž",
    title: "Sestavljanke - Ž",
    description: "Reši sestavljanke s črko Ž",
    letter: "Ž",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/sestavljanke/ž",
    available: false
  }
];

export default function SestavljankeGames() {
  const navigate = useNavigate();
  
  const handleCardClick = (game: typeof puzzleGames[0]) => {
    if (game.available) {
      navigate(game.path);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Sestavljanke" backPath="/govorne-igre" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed sestavljank in začni vaditi logično razmišljanje na zabaven način.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {puzzleGames.map((game) => (
            <Card 
              key={game.id}
              className={`transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col ${
                game.available 
                  ? 'cursor-pointer hover:scale-105' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleCardClick(game)}
            >
              <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-2xl pb-4`}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <span className={`text-2xl font-bold ${game.color}`}>
                      {game.letter}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className={`text-lg font-semibold mb-2 ${game.color}`}>{game.title}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
                {!game.available && (
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
}