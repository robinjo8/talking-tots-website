
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Puzzle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    id: "spomin-k",
    title: "Spomin (besede na črko K)",
    description: "Igra spomin za vajo izgovorjave črke K",
    path: "/govorne-igre/spomin/spomin-k",
    available: true
  },
  {
    id: "spomin-s",
    title: "Spomin (besede na črko S)",
    description: "Igra spomin za vajo izgovorjave črke S",
    path: "/govorne-igre/spomin/spomin-s",
    available: true
  },
  {
    id: "spomin-š",
    title: "Spomin (besede na črko Š)",
    description: "Igra spomin za vajo izgovorjave črke Š",
    path: "/govorne-igre/spomin/spomin-š",
    available: true
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

export default function SpominGames() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorne-igre")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Spomin
          </h1>
        </div>
        
        <Card className="bg-dragon-green/5 mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-2">Izberi igro spomin</h2>
            <p className="text-muted-foreground">
              Izberi eno izmed iger spomin in začni vaditi izgovorjavo določene črke na zabaven način.
            </p>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
