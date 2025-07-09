
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Gamepad, SquareDashed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const otherGames = [
  {
    id: "spomin",
    title: "Spomin",
    description: "Igraj spomin in vadi izgovorjavo",
    icon: Puzzle,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorne-igre/spomin",
    available: true
  },
  {
    id: "drsne-stevilke",
    title: "Drsne številke",
    description: "Igraj drsne številke in vadi logično razmišljanje",
    icon: Gamepad,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/drsne-stevilke",
    available: true
  },
  {
    id: "sestavljanke",
    title: "Sestavljanke",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10",
    available: false
  },
  {
    id: "igra4",
    title: "Igra 4",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    available: false
  },
  {
    id: "igra5",
    title: "Igra 5",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    available: false
  },
  {
    id: "igra6",
    title: "Igra 6",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10",
    available: false
  },
  {
    id: "igra7",
    title: "Igra 7",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    available: false
  },
  {
    id: "igra8",
    title: "Igra 8",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    available: false
  },
  {
    id: "igra9",
    title: "Igra 9",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10",
    available: false
  },
  {
    id: "igra10",
    title: "Igra 10",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    available: false
  }
];

export function GamesList() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {otherGames.map((game) => (
        <Card 
          key={game.id}
          className={cn(
            "transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col",
            game.available ? "cursor-pointer" : "opacity-50"
          )}
          onClick={() => game.available && game.path && navigate(game.path)}
        >
          <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-2xl pb-4`}>
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                {game.icon && <game.icon className={`h-6 w-6 ${game.color}`} />}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center">
            <h3 className={cn("text-lg font-semibold mb-2", game.color)}>{game.title}</h3>
            <p className="text-sm text-gray-600">{game.description}</p>
            {!game.available && (
              <div className="mt-3 text-sm text-muted-foreground italic">
                Kmalu na voljo
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
