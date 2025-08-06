import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Gamepad, SquareDashed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
const otherGames = [{
  id: "spomin",
  title: "SPOMIN",
  description: "Igraj spomin in vadi izgovorjavo",
  icon: Puzzle,
  image: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/spomin.png?t=${new Date().getTime()}`,
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/spomin",
  available: true
}, {
  id: "sestavljanke",
  title: "SESTAVLJANKE",
  description: "Igraj sestavljanke in vadi logično razmišljanje",
  icon: SquareDashed,
  image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/sestavljanka.png",
  color: "text-app-teal",
  gradient: "from-app-teal/10 to-dragon-green/10",
  path: "/govorne-igre/sestavljanke",
  available: true
}, {
  id: "zaporedja",
  title: "ZAPOREDJA",
  description: "Kmalu na voljo",
  icon: SquareDashed,
  image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/zaporedja.png",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  available: false
}, {
  id: "drsna-sestavljanka",
  title: "DRSNA SESTAVLJANKA",
  description: "Kmalu na voljo",
  icon: SquareDashed,
  image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/drsna_sestavljanka.png",
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  available: false
}, {
  id: "povezi-pare-matching",
  title: "IGRA UJEMANJA",
  description: "Poveži enake slike med stolpci",
  icon: SquareDashed,
  image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/povezi_pare.png",
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  path: "/govorne-igre/povezi-pare-5-6",
  available: true
}, {
  id: "igra8",
  title: "Igra 8",
  description: "Kmalu na voljo",
  icon: SquareDashed,
  color: "text-app-orange",
  gradient: "from-app-orange/10 to-app-yellow/10",
  available: false
}, {
  id: "igra9",
  title: "Igra 9",
  description: "Kmalu na voljo",
  icon: SquareDashed,
  color: "text-app-teal",
  gradient: "from-app-teal/10 to-dragon-green/10",
  available: false
}, {
  id: "igra10",
  title: "Igra 10",
  description: "Kmalu na voljo",
  icon: SquareDashed,
  color: "text-app-purple",
  gradient: "from-app-purple/10 to-app-blue/10",
  available: false
}];
export function GamesList() {
  const navigate = useNavigate();
  const activeGames = otherGames.filter(game => game.available);
  const inactiveGames = otherGames.filter(game => !game.available);
  return <>
      {/* Available Games Section */}
      <div className="mb-12">
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {activeGames.map(game => <Card key={game.id} className={cn("transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer")} onClick={() => game.path && navigate(game.path)}>
              {/* Top colored section with game name */}
              <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-3xl pb-2 md:pb-4`}>
                <CardTitle className="text-sm md:text-lg font-semibold text-center whitespace-nowrap">
                  <span className={`${game.color}`}>
                    {game.title}
                  </span>
                </CardTitle>
              </CardHeader>
              
              {/* Content section with consistent height and flex layout */}
              <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
                <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                  {game.image ? <img src={game.image} alt={game.title} className="w-full h-full object-contain" /> : <game.icon className={`h-10 w-10 md:h-20 md:w-20 ${game.color}`} />}
                </div>
                <p className="text-xs md:text-sm text-gray-600 leading-tight">{game.description}</p>
              </CardContent>
              <CardFooter className="pb-3 md:pb-6 mt-auto">
                <Button 
                  className={`w-full rounded-2xl text-xs md:text-sm py-2 md:py-3 ${
                    game.id === "spomin" ? "bg-app-purple hover:bg-app-purple/90" :
                    game.id === "sestavljanke" ? "bg-app-teal hover:bg-app-teal/90" :
                    "bg-app-teal hover:bg-app-teal/90"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    game.path && navigate(game.path);
                  }}
                >
                  ZAČNI IGRO
                </Button>
              </CardFooter>
            </Card>)}
        </div>
      </div>

      {/* Unavailable Games Section */}
      {inactiveGames.length > 0 && <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-muted-foreground">
            KMALU NA VOLJO
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {inactiveGames.map(game => <Card key={game.id} className={cn("transition-all duration-300 rounded-3xl border-2 border-gray-200 h-full flex flex-col opacity-60 cursor-not-allowed")}>
                {/* Top colored section with game name */}
                <CardHeader className={`bg-gradient-to-r ${game.gradient} rounded-t-3xl pb-2 md:pb-4`}>
                  <CardTitle className="text-sm md:text-lg font-semibold text-center whitespace-nowrap">
                    <span className={`${game.color}`}>
                      {game.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                {/* Content section with consistent height and flex layout */}
                <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
                  <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                    {game.image ? <img src={game.image} alt={game.title} className="w-full h-full object-contain" /> : <game.icon className={`h-10 w-10 md:h-20 md:w-20 ${game.color}`} />}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 leading-tight italic">KMALU NA VOLJO</p>
                </CardContent>
              </Card>)}
          </div>
        </div>}
    </>;
}