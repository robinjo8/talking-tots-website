
import { Card, CardContent } from "@/components/ui/card";
import { Puzzle, Gamepad, SquareDashed, GameController } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const memoryGames = [
  {
    id: "spomin-r",
    title: "Spomin (besede na črko R)",
    description: "Igra spomin za vajo izgovorjave črke R",
    path: "/govorne-igre/spomin/spomin-r",
    available: true
  },
  {
    id: "spomin-l",
    title: "Spomin (besede na črko L)",
    description: "Igra spomin za vajo izgovorjave črke L",
    available: false
  },
  {
    id: "spomin-s",
    title: "Spomin (besede na črko S)",
    description: "Igra spomin za vajo izgovorjave črke S",
    available: false
  },
  {
    id: "spomin-š",
    title: "Spomin (besede na črko Š)",
    description: "Igra spomin za vajo izgovorjave črke Š",
    available: false
  },
  {
    id: "spomin-c",
    title: "Spomin (besede na črko C)",
    description: "Igra spomin za vajo izgovorjave črke C",
    available: false
  },
  {
    id: "spomin-č",
    title: "Spomin (besede na črko Č)",
    description: "Igra spomin za vajo izgovorjave črke Č",
    available: false
  },
  {
    id: "spomin-z",
    title: "Spomin (besede na črko Z)",
    description: "Igra spomin za vajo izgovorjave črke Z",
    available: false
  },
  {
    id: "spomin-ž",
    title: "Spomin (besede na črko Ž)",
    description: "Igra spomin za vajo izgovorjave črke Ž",
    available: false
  }
];

const otherGames = [
  {
    id: "spomin",
    title: "Spomin",
    description: "Kmalu na voljo",
    icon: Gamepad,
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {memoryGames.map((game) => (
          <Card 
            key={game.id}
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              game.available ? "cursor-pointer" : "opacity-50"
            )}
            onClick={() => game.available && game.path && navigate(game.path)}
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-app-purple/10 to-app-blue/10 rounded-lg p-4 mb-4 flex items-center justify-center">
                <Puzzle className="h-8 w-8 text-app-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">{game.title}</h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
              {!game.available && (
                <div className="mt-3 text-sm text-muted-foreground italic">
                  Kmalu na voljo
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {otherGames.map((game) => (
          <Card 
            key={game.id}
            className="transition-all duration-300 hover:shadow-md opacity-50"
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
    </div>
  );
}
