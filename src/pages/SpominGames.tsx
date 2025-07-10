
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const memoryGames = [
  {
    id: "spomin-a",
    title: "Spomin - A",
    description: "Poišči pare slik s črko A",
    letter: "A",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-a",
    available: false
  },
  {
    id: "spomin-b",
    title: "Spomin - B",
    description: "Poišči pare slik s črko B",
    letter: "B",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-b",
    available: false
  },
  {
    id: "spomin-c",
    title: "Spomin - C",
    description: "Poišči pare slik s črko C",
    letter: "C",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-c",
    available: false
  },
  {
    id: "spomin-č",
    title: "Spomin - Č",
    description: "Poišči pare slik s črko Č",
    letter: "Č",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-č",
    available: false
  },
  {
    id: "spomin-d",
    title: "Spomin - D",
    description: "Poišči pare slik s črko D",
    letter: "D",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-d",
    available: false
  },
  {
    id: "spomin-e",
    title: "Spomin - E",
    description: "Poišči pare slik s črko E",
    letter: "E",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-e",
    available: false
  },
  {
    id: "spomin-f",
    title: "Spomin - F",
    description: "Poišči pare slik s črko F",
    letter: "F",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-f",
    available: false
  },
  {
    id: "spomin-g",
    title: "Spomin - G",
    description: "Poišči pare slik s črko G",
    letter: "G",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-g",
    available: false
  },
  {
    id: "spomin-h",
    title: "Spomin - H",
    description: "Poišči pare slik s črko H",
    letter: "H",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-h",
    available: false
  },
  {
    id: "spomin-i",
    title: "Spomin - I",
    description: "Poišči pare slik s črko I",
    letter: "I",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-i",
    available: false
  },
  {
    id: "spomin-j",
    title: "Spomin - J",
    description: "Poišči pare slik s črko J",
    letter: "J",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-j",
    available: false
  },
  {
    id: "spomin-k",
    title: "Spomin - K",
    description: "Poišči pare slik s črko K",
    letter: "K",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-k",
    available: true
  },
  {
    id: "spomin-l",
    title: "Spomin - L",
    description: "Poišči pare slik s črko L",
    letter: "L",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-l",
    available: false
  },
  {
    id: "spomin-m",
    title: "Spomin - M",
    description: "Poišči pare slik s črko M",
    letter: "M",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-m",
    available: false
  },
  {
    id: "spomin-n",
    title: "Spomin - N",
    description: "Poišči pare slik s črko N",
    letter: "N",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-n",
    available: false
  },
  {
    id: "spomin-o",
    title: "Spomin - O",
    description: "Poišči pare slik s črko O",
    letter: "O",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-o",
    available: false
  },
  {
    id: "spomin-p",
    title: "Spomin - P",
    description: "Poišči pare slik s črko P",
    letter: "P",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-p",
    available: false
  },
  {
    id: "spomin-r",
    title: "Spomin - R",
    description: "Poišči pare slik s črko R",
    letter: "R",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-r",
    available: true
  },
  {
    id: "spomin-s",
    title: "Spomin - S",
    description: "Poišči pare slik s črko S",
    letter: "S",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-s",
    available: true
  },
  {
    id: "spomin-š",
    title: "Spomin - Š",
    description: "Poišči pare slik s črko Š",
    letter: "Š",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-š",
    available: true
  },
  {
    id: "spomin-t",
    title: "Spomin - T",
    description: "Poišči pare slik s črko T",
    letter: "T",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-t",
    available: false
  },
  {
    id: "spomin-u",
    title: "Spomin - U",
    description: "Poišči pare slik s črko U",
    letter: "U",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-u",
    available: false
  },
  {
    id: "spomin-v",
    title: "Spomin - V",
    description: "Poišči pare slik s črko V",
    letter: "V",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-v",
    available: false
  },
  {
    id: "spomin-z",
    title: "Spomin - Z",
    description: "Poišči pare slik s črko Z",
    letter: "Z",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-z",
    available: false
  },
  {
    id: "spomin-ž",
    title: "Spomin - Ž",
    description: "Poišči pare slik s črko Ž",
    letter: "Ž",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-ž",
    available: false
  }
];

export default function SpominGames() {
  const navigate = useNavigate();
  
  const handleCardClick = (game: typeof memoryGames[0]) => {
    if (game.available) {
      navigate(game.path);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {memoryGames.map((game) => (
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
