
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Dog, Puzzle } from "lucide-react";

export function GamesList() {
  const navigate = useNavigate();

  const games = [
    {
      title: "Spomin - R",
      description: "Igra spomina z besedami, ki vsebujejo glas R",
      path: "/govorne-igre/spomin/spomin-r",
      icon: <Puzzle className="h-5 w-5" />,
    },
    {
      title: "Spomin - K",
      description: "Igra spomina z besedami, ki vsebujejo glas K",
      path: "/govorne-igre/spomin/spomin-k",
      icon: <Puzzle className="h-5 w-5" />,
    },
    {
      title: "Spomin - S",
      description: "Igra spomina z besedami, ki vsebujejo glas S",
      path: "/govorne-igre/spomin/spomin-s",
      icon: <Puzzle className="h-5 w-5" />,
    },
    {
      title: "Spomin - Š",
      description: "Igra spomina z besedami, ki vsebujejo glas Š",
      path: "/govorne-igre/spomin/spomin-š",
      icon: <Puzzle className="h-5 w-5" />,
    },
    {
      title: "Živali - Kuža",
      description: "Igra z živalmi za vajo besede \"kuža\"",
      path: "/govorne-igre/zivali",
      icon: <Dog className="h-5 w-5" />,
      isNew: true,
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-dragon-green/10 p-2 rounded-lg">
                  {game.icon || <Gamepad2 className="h-5 w-5 text-dragon-green" />}
                </div>
                <h3 className="text-xl font-bold">{game.title}</h3>
              </div>
              
              {game.isNew && (
                <div className="bg-dragon-green text-white text-xs font-bold px-2 py-1 rounded">
                  NOVO
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground text-sm">{game.description}</p>
            
            <div className="pt-4">
              <Button
                onClick={() => navigate(game.path)}
                className="w-full bg-dragon-green hover:bg-dragon-green/90"
              >
                Igraj
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
