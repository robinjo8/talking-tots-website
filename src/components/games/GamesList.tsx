
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
    image: "/lovable-uploads/7b964716-839d-4c87-b6b1-04a4f3af5271.png",
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
    image: null,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorne-igre/drsne-stevilke",
    available: true
  },
  {
    id: "sestavljanke",
    title: "Sestavljanke",
    description: "Igraj sestavljanke in vadi logično razmišljanje",
    icon: SquareDashed,
    image: "/lovable-uploads/72915882-0746-4362-afc3-bebd9148890a.png",
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10",
    path: "/govorne-igre/sestavljanke",
    available: true
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
  
  const activeGames = otherGames.filter(game => game.available);
  const inactiveGames = otherGames.filter(game => !game.available);
  
  return (
    <>
      {/* Available Games Section */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-primary">
          Izberi igro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeGames.map((game) => (
            <Card 
              key={game.id}
              className={cn(
                "transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:scale-105"
              )}
              onClick={() => game.path && navigate(game.path)}
              style={{ aspectRatio: '3/4', minHeight: '300px' }}
            >
              {/* Top colored section with game name */}
              <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-2xl pb-3 sm:pb-4 flex-shrink-0`}>
                <CardTitle className="text-lg sm:text-xl text-center">
                  <span className={`font-bold ${game.color}`}>
                    {game.title}
                  </span>
                </CardTitle>
              </CardHeader>
              
              {/* Bottom white section with image */}
              <CardContent className="pt-4 pb-4 flex-grow flex items-center justify-center bg-white rounded-b-2xl">
                {game.image ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                    <game.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${game.color}`} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unavailable Games Section */}
      {inactiveGames.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-muted-foreground">
            Kmalu na voljo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveGames.map((game) => (
              <Card 
                key={game.id}
                className={cn(
                  "transition-all duration-300 rounded-2xl border-2 border-gray-200 overflow-hidden flex flex-col opacity-60 cursor-not-allowed"
                )}
                style={{ aspectRatio: '3/4', minHeight: '300px' }}
              >
                {/* Top colored section with game name */}
                <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-2xl pb-3 sm:pb-4 flex-shrink-0`}>
                  <CardTitle className="text-lg sm:text-xl text-center">
                    <span className={`font-bold ${game.color}`}>
                      {game.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                {/* Bottom white section with image */}
                <CardContent className="pt-4 pb-4 flex-grow flex flex-col items-center justify-center bg-white rounded-b-2xl">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                    <game.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${game.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground italic text-center">
                    Kmalu na voljo
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
