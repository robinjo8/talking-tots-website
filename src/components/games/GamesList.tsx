import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function GamesList() {
  const navigate = useNavigate();

  const games = [
    {
      title: "Spomin",
      description: "Različne igre spomina za urjenje spomina in pozornosti",
      icon: "🧠",
      path: "/govorne-igre/spomin",
      color: "from-green-400 to-lime-500",
      difficulty: "Srednja",
      ageRange: "4-10 let"
    },
    {
      title: "Poveži Pare",
      description: "Poišči pare kartic s slikami in besedami",
      icon: "🔗",
      path: "/govorne-igre/povezi-pare",
      color: "from-orange-400 to-yellow-500",
      difficulty: "Srednja",
      ageRange: "5-10 let"
    },
    {
      title: "Sestavljanke",
      description: "Sestavljanke za razvoj motoričnih sposobnosti in logičnega razmišljanja",
      icon: "🧩",
      path: "/govorne-igre/sestavljanke",
      color: "from-blue-400 to-purple-500",
      difficulty: "Težka",
      ageRange: "6-10 let"
    },
    {
      title: "Prilagodljive Sestavljanke",
      description: "Sestavljanke prilagojene starosti otroka",
      icon: "🧩",
      path: "/govorne-igre/adaptive-puzzle",
      color: "from-purple-500 to-pink-500",
      difficulty: "Prilagojeno starosti",
      ageRange: "3-10 let"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game, index) => (
        <Card
          key={index}
          className="bg-card text-card-foreground shadow-md transition-colors hover:shadow-lg cursor-pointer"
          onClick={() => navigate(game.path)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="text-2xl">{game.icon}</span>
              {game.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{game.description}</p>
            <div className="mt-4 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Težavnost:</span>
                <span className="text-muted-foreground">{game.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Primerno za starost:</span>
                <span className="text-muted-foreground">{game.ageRange}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
