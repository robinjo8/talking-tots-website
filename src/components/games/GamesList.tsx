import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const otherGames = [
  {
    id: "kolo-srece",
    title: "KOLO BESED",
    description: "Zavrti kolo sreče in vadi izgovorjavo črk",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/kolo_srece_nova_2.webp",
    gradient: "from-app-orange/20 to-app-yellow/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/kolo-srece",
    available: true,
    imageScale: "90%"
  },
  {
    id: "bingo",
    title: "BINGO",
    description: "Igraj bingo in vadi izgovorjavo črk",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/bingo_nova_2.webp",
    gradient: "from-dragon-green/20 to-app-teal/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/bingo",
    available: true,
    imageScale: "90%"
  },
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Igraj spomin in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_nova_2.webp",
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/spomin",
    available: true,
    imageScale: "90%"
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Igraj sestavljanke in vadi logično razmišljanje",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_21.webp",
    gradient: "from-app-teal/20 to-dragon-green/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/sestavljanke",
    available: true,
    imageScale: "90%"
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Uredi zaporedje slik in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja_nova_2.webp",
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/zaporedja",
    available: true,
    imageScale: "90%"
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA IGRA",
    description: "Drsne sestavljanke za vajo izgovorjave",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_sestavljanka_nova_2.webp",
    gradient: "from-app-orange/20 to-app-yellow/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/drsna-sestavljanka",
    available: true,
    imageScale: "90%"
  },
  {
    id: "povezi-pare-matching",
    title: "IGRA UJEMANJA",
    description: "Poveži enake slike med stolpci",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/igra_ujemanja_2.webp",
    gradient: "from-app-purple/20 to-app-blue/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/igra-ujemanja",
    available: true,
    imageScale: "90%"
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Poišči pot skozi labirint in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/labirint_nova_2.webp",
    gradient: "from-app-orange/20 to-app-yellow/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/labirint",
    available: true,
    imageScale: "90%"
  },
  {
    id: "met-kocke",
    title: "SMEŠNE POVEDI",
    description: "Vrzi kocko in sestavi smešne povedi",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Smesne_besede_2.webp",
    gradient: "from-app-purple/20 to-dragon-green/20",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/govorne-igre/met-kocke",
    available: true,
    imageScale: "90%"
  },
  {
    id: "pobarvanke",
    title: "POBARVANKE",
    description: "Kmalu na voljo",
    gradient: "from-app-teal/20 to-dragon-green/20",
    available: false
  },
  {
    id: "povezi-pike",
    title: "POVEŽI PIKE",
    description: "Kmalu na voljo",
    gradient: "from-app-purple/20 to-app-blue/20",
    available: false
  },
  {
    id: "igra-razvrscanja",
    title: "RAZVRŠČANJE",
    description: "Kmalu na voljo",
    gradient: "from-app-orange/20 to-app-yellow/20",
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
                <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
                  {/* Custom gradient background */}
                  {game.customBackground && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: game.customBackground
                      }}
                    />
                  )}
                  {/* Image on top - scaled per game */}
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img 
                      src={game.image}
                      alt={game.title}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      style={{
                        maxWidth: game.imageScale || "90%",
                        maxHeight: game.imageScale || "90%",
                        ...(['zaporedja', 'povezi-pare-matching', 'labirint'].includes(game.id) ? { mixBlendMode: 'multiply' } : {})
                      }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className={isMobile ? "p-3 flex flex-col flex-grow" : "p-6 flex flex-col flex-grow"}>
                  <h3 className={isMobile 
                    ? "text-base font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors leading-tight text-center" 
                    : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors min-h-[3.5rem] flex items-center"
                  }>
                    {game.title}
                  </h3>
                  <p className={isMobile 
                    ? "text-xs text-muted-foreground leading-tight line-clamp-2 text-center" 
                    : "text-sm text-muted-foreground leading-relaxed line-clamp-3"
                  }>
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
                <div className={isMobile ? "p-3 flex flex-col flex-grow" : "p-6 flex flex-col flex-grow"}>
                  <h3 className={isMobile 
                    ? "text-base font-bold text-foreground mb-1 leading-tight text-center" 
                    : "text-xl font-bold text-foreground mb-3 min-h-[3.5rem] flex items-center"
                  }>
                    {game.title}
                  </h3>
                  <p className={isMobile 
                    ? "text-xs text-muted-foreground leading-tight line-clamp-2 text-center italic" 
                    : "text-sm text-muted-foreground leading-relaxed line-clamp-3 italic"
                  }>
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
