import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const otherGames = [
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Igraj spomin in vadi izgovorjavo",
    image: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_4.png?t=${new Date().getTime()}`,
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/spomin",
    available: true
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Igraj sestavljanke in vadi logično razmišljanje",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_4.png",
    gradient: "from-app-teal/20 to-dragon-green/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/sestavljanke",
    available: true
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Uredi zaporedje slik in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/zaporedja",
    available: true
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA SESTAVLJANKA",
    description: "Drsne sestavljanke za vajo izgovorjave",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_4.png",
    gradient: "from-app-orange/20 to-app-yellow/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/drsna-sestavljanka",
    available: true
  },
  {
    id: "povezi-pare-matching",
    title: "IGRA UJEMANJA",
    description: "Poveži enake slike med stolpci",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/povezi_pare_4.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/igra-ujemanja",
    available: true
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Poišči pot skozi labirint in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/labirint_4.png",
    gradient: "from-app-orange/20 to-app-yellow/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 92%) 0%, hsl(42, 100%, 88%) 30%, hsl(38, 100%, 70%) 60%, hsl(33, 100%, 50%) 100%)",
    path: "/govorne-igre/labirint",
    available: true
  },
  {
    id: "igra9",
    title: "Igra 9",
    description: "Kmalu na voljo",
    gradient: "from-app-teal/20 to-dragon-green/20",
    available: false
  },
  {
    id: "igra10",
    title: "Igra 10",
    description: "Kmalu na voljo",
    gradient: "from-app-purple/20 to-app-blue/20",
    available: false
  }
];

export function GamesList() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const activeGames = otherGames.filter(game => game.available);
  const inactiveGames = otherGames.filter(game => !game.available);

  const handleGameClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {/* Available Games Section */}
      <div className="mb-12">
        <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {activeGames.map((game) => (
            <div key={game.id} className="flex h-full">
              <div
                className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col w-full"
                onClick={() => handleGameClick(game.path)}
              >
                {/* Card Image */}
                <div className="relative aspect-video overflow-hidden">
                  {/* Custom gradient background */}
                  {game.customBackground && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: game.customBackground
                      }}
                    />
                  )}
                  {/* Image on top - 100% opacity */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors min-h-[3.5rem] flex items-center">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {game.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unavailable Games Section */}
      {inactiveGames.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-muted-foreground">
            KMALU NA VOLJO
          </h2>
          <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
            {inactiveGames.map((game) => (
              <div
                key={game.id}
                className="bg-card rounded-xl shadow-md transition-all duration-300 overflow-hidden opacity-60 cursor-not-allowed"
              >
                {/* Card Image */}
                <div 
                  className="relative aspect-video overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle, rgb(255, 171, 0) 0%, rgb(234, 88, 12) 100%)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {game.image ? (
                      <img 
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-6xl">🎮</div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Kmalu na voljo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
