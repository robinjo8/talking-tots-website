
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Type, Volume2, Gamepad2 } from "lucide-react";

const memoryGames = [
  {
    id: "spomin-r",
    title: "Spomin - R",
    description: "Poišči pare slik s črko R",
    icon: Type,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin/spomin-r",
    available: true
  },
  {
    id: "spomin-k",
    title: "Spomin - K",
    description: "Poišči pare slik s črko K",
    icon: Volume2,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/spomin/spomin-k",
    available: true
  },
  {
    id: "spomin-s",
    title: "Spomin - S",
    description: "Poišči pare slik s črko S",
    icon: Gamepad2,
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorne-igre/spomin/spomin-s",
    available: true
  },
  {
    id: "spomin-š",
    title: "Spomin - Š",
    description: "Poišči pare slik s črko Š",
    icon: BrainCircuit,
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorne-igre/spomin/spomin-š",
    available: true
  }
];

export default function SpominGames() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Spomin igre" backPath="/govorne-igre" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed spomin iger in začni vaditi izgovorjavo na zabaven način.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoryGames.map((game) => (
            <Card 
              key={game.id}
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => navigate(game.path)}
            >
              <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-2xl pb-4`}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    {game.icon && <game.icon className={`h-6 w-6 ${game.color}`} />}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className={`text-lg font-semibold mb-2 ${game.color}`}>{game.title}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
