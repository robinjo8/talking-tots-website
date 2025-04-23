
import { Card, CardContent } from "@/components/ui/card";
import { Puzzle, Gamepad, SquareDashed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: "igra1",
    title: "Igra 1",
    description: "Kmalu na voljo",
    icon: Puzzle,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10"
  },
  {
    id: "igra2",
    title: "Igra 2",
    description: "Kmalu na voljo",
    icon: Gamepad,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10"
  },
  {
    id: "igra3",
    title: "Igra 3",
    description: "Kmalu na voljo",
    icon: SquareDashed,
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10"
  }
];

export function GamesList() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <Card 
          key={game.id}
          className="transition-all duration-300 hover:shadow-md cursor-pointer"
        >
          <CardContent className="p-6">
            <div className={`bg-gradient-to-br ${game.gradient} rounded-lg p-4 mb-4 flex items-center justify-center`}>
              {game.icon && <game.icon className={`h-8 w-8 ${game.color}`} />}
            </div>
            <h3 className="font-bold text-lg mb-2">{game.title}</h3>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
