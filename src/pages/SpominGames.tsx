
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Puzzle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const memoryGames = [
  {
    id: "spomin-b",
    title: "Besede na črko B",
    description: "Igra spomin za vajo izgovorjave črke B",
    path: "/govorne-igre/spomin/spomin-b",
    available: false
  },
  {
    id: "spomin-c",
    title: "Besede na črko C",
    description: "Igra spomin za vajo izgovorjave črke C",
    path: "/govorne-igre/spomin/spomin-c",
    available: false
  },
  {
    id: "spomin-č",
    title: "Besede na črko Č",
    description: "Igra spomin za vajo izgovorjave črke Č",
    path: "/govorne-igre/spomin/spomin-č",
    available: false
  },
  {
    id: "spomin-d",
    title: "Besede na črko D",
    description: "Igra spomin za vajo izgovorjave črke D",
    path: "/govorne-igre/spomin/spomin-d",
    available: false
  },
  {
    id: "spomin-f",
    title: "Besede na črko F",
    description: "Igra spomin za vajo izgovorjave črke F",
    path: "/govorne-igre/spomin/spomin-f",
    available: false
  },
  {
    id: "spomin-g",
    title: "Besede na črko G",
    description: "Igra spomin za vajo izgovorjave črke G",
    path: "/govorne-igre/spomin/spomin-g",
    available: false
  },
  {
    id: "spomin-h",
    title: "Besede na črko H",
    description: "Igra spomin za vajo izgovorjave črke H",
    path: "/govorne-igre/spomin/spomin-h",
    available: false
  },
  {
    id: "spomin-j",
    title: "Besede na črko J",
    description: "Igra spomin za vajo izgovorjave črke J",
    path: "/govorne-igre/spomin/spomin-j",
    available: false
  },
  {
    id: "spomin-k",
    title: "Besede na črko K",
    description: "Igra spomin za vajo izgovorjave črke K",
    path: "/govorne-igre/spomin/spomin-k",
    available: true
  },
  {
    id: "spomin-l",
    title: "Besede na črko L",
    description: "Igra spomin za vajo izgovorjave črke L",
    path: "/govorne-igre/spomin/spomin-l",
    available: false
  },
  {
    id: "spomin-m",
    title: "Besede na črko M",
    description: "Igra spomin za vajo izgovorjave črke M",
    path: "/govorne-igre/spomin/spomin-m",
    available: false
  },
  {
    id: "spomin-n",
    title: "Besede na črko N",
    description: "Igra spomin za vajo izgovorjave črke N",
    path: "/govorne-igre/spomin/spomin-n",
    available: false
  },
  {
    id: "spomin-p",
    title: "Besede na črko P",
    description: "Igra spomin za vajo izgovorjave črke P",
    path: "/govorne-igre/spomin/spomin-p",
    available: false
  },
  {
    id: "spomin-r",
    title: "Besede na črko R",
    description: "Igra spomin za vajo izgovorjave črke R",
    path: "/govorne-igre/spomin/spomin-r",
    available: true
  },
  {
    id: "spomin-s",
    title: "Besede na črko S",
    description: "Igra spomin za vajo izgovorjave črke S",
    path: "/govorne-igre/spomin/spomin-s",
    available: true
  },
  {
    id: "spomin-š",
    title: "Besede na črko Š",
    description: "Igra spomin za vajo izgovorjave črke Š",
    path: "/govorne-igre/spomin/spomin-š",
    available: true
  },
  {
    id: "spomin-t",
    title: "Besede na črko T",
    description: "Igra spomin za vajo izgovorjave črke T",
    path: "/govorne-igre/spomin/spomin-t",
    available: false
  },
  {
    id: "spomin-v",
    title: "Besede na črko V",
    description: "Igra spomin za vajo izgovorjave črke V",
    path: "/govorne-igre/spomin/spomin-v",
    available: false
  },
  {
    id: "spomin-z",
    title: "Besede na črko Z",
    description: "Igra spomin za vajo izgovorjave črke Z",
    path: "/govorne-igre/spomin/spomin-z",
    available: false
  },
  {
    id: "spomin-ž",
    title: "Besede na črko Ž",
    description: "Igra spomin za vajo izgovorjave črke Ž",
    path: "/govorne-igre/spomin/spomin-ž",
    available: false
  }
];

export default function SpominGames() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
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
          
          <h1 className="text-2xl font-bold text-foreground">
            Spomin
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed iger spomin in začni vaditi izgovorjavo določene črke na zabaven način.
        </p>
        
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
