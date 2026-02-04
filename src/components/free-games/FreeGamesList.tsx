import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

const FREE_GAMES: GameCard[] = [
  {
    id: "bingo",
    title: "BINGO",
    description: "Poišči besede na tabli",
    icon: "🎯",
    path: "/brezplacne-igre/bingo",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Najdi pare slik",
    icon: "🧠",
    path: "/brezplacne-igre/spomin",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Sestavi sliko",
    icon: "🧩",
    path: "/brezplacne-igre/sestavljanke",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Razvrsti po vrstnem redu",
    icon: "🔢",
    path: "/brezplacne-igre/zaporedja",
    color: "from-teal-400 to-teal-600",
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA IGRA",
    description: "Premikaj dele slike",
    icon: "⬛",
    path: "/brezplacne-igre/drsna-sestavljanka",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: "igra-ujemanja",
    title: "IGRA UJEMANJA",
    description: "Poveži pare",
    icon: "🔗",
    path: "/brezplacne-igre/igra-ujemanja",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Najdi pot do cilja",
    icon: "🌀",
    path: "/brezplacne-igre/labirint",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    id: "met-kocke",
    title: "SMEŠNE POVEDI",
    description: "Vrži kocko in ponovi poved",
    icon: "🎲",
    path: "/brezplacne-igre/met-kocke",
    color: "from-amber-400 to-amber-600",
  },
  {
    id: "ponovi-poved",
    title: "PONOVI POVED",
    description: "Ponovi celotno poved",
    icon: "🗣️",
    path: "/brezplacne-igre/ponovi-poved",
    color: "from-green-400 to-green-600",
  },
];

export function FreeGamesList() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {FREE_GAMES.map((game) => (
        <Card
          key={game.id}
          onClick={() => navigate(game.path)}
          className={`cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden`}
        >
          <div className={`bg-gradient-to-br ${game.color} p-4 text-white`}>
            <div className="text-4xl mb-2">{game.icon}</div>
            <h3 className="font-bold text-sm md:text-base">{game.title}</h3>
            <p className="text-xs opacity-80">{game.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
