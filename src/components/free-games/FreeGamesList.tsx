import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const FREE_GAMES = [
  {
    id: "bingo",
    title: "BINGO",
    description: "Poišči besede na tabli",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/bingo_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/bingo",
    imageScale: "95%"
  },
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Najdi pare slik",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/spomin",
    imageScale: "90%"
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Sestavi sliko",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_nova_1.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/sestavljanke",
    imageScale: "85%"
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Razvrsti po vrstnem redu",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/zaporedja",
    imageScale: "95%"
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA IGRA",
    description: "Premikaj dele slike",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_sestavljanka_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/drsna-sestavljanka",
    imageScale: "90%"
  },
  {
    id: "igra-ujemanja",
    title: "IGRA UJEMANJA",
    description: "Poveži pare",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/igra_ujemanja_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/igra-ujemanja",
    imageScale: "90%"
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Najdi pot do cilja",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/labirint_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/labirint",
    imageScale: "95%"
  },
  {
    id: "met-kocke",
    title: "SMEŠNE POVEDI",
    description: "Vrži kocko in ponovi poved",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Smesne_besede_21.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/met-kocke",
    imageScale: "90%"
  },
  {
    id: "ponovi-poved",
    title: "PONOVI POVED",
    description: "Ponovi celotno poved",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_1.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    path: "/brezplacne-igre/ponovi-poved",
    imageScale: "85%"
  },
];

export function FreeGamesList() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "grid grid-cols-2 gap-4 p-4" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 p-4"}>
      {FREE_GAMES.map((game) => (
        <div key={game.id} className="flex h-full">
          <div
            className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col w-full"
            onClick={() => navigate(game.path)}
          >
            {/* Card Image */}
            <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
              {/* Custom gradient background */}
              <div 
                className="absolute inset-0"
                style={{
                  background: game.customBackground
                }}
              />
              {/* Image on top - scaled per game */}
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <img 
                  src={game.image}
                  alt={game.title}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{
                    maxWidth: game.imageScale || "90%",
                    maxHeight: game.imageScale || "90%",
                    ...(['zaporedja', 'igra-ujemanja', 'labirint'].includes(game.id) ? { mixBlendMode: 'multiply' as const } : {})
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
  );
}
