import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

// Games list - matching user portal (GamesList.tsx) order, titles, descriptions, images
const games = [
  {
    id: "kolo-srece",
    title: "KOLO BESED",
    description: "Zavrti kolo sreče in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/kolo_srece_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "90%"
  },
  {
    id: "igra-ujemanja",
    title: "IGRA UJEMANJA",
    description: "Poveži slike in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/igra_ujemanja_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "90%"
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Uredi zaporedje slik in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "95%"
  },
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Igraj spomin in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "90%"
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA IGRA",
    description: "Drsne sestavljanke za vajo izgovorjave glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_sestavljanka_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "90%"
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Poišči pot skozi labirint in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/labirint_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "95%"
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Igraj sestavljanke in vadi izgovorjavo glasov na začetku besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_nova_1.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "85%"
  },
  {
    id: "kace",
    title: "ZABAVNA POT",
    description: "Igraj zabavno pot ter vadi izgovorjavo glasov na sredini in koncu besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zabavna_pot_1.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(120, 60%, 95%) 0%, hsl(120, 50%, 88%) 30%, hsl(120, 45%, 78%) 60%, hsl(120, 40%, 68%) 100%)",
    imageScale: "90%"
  },
  {
    id: "bingo",
    title: "BINGO",
    description: "Igraj bingo in vadi izgovorjavo glasov na sredini in koncu besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/bingo_nova_2.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "95%"
  },
  {
    id: "ponovi-poved",
    title: "PONOVI POVED",
    description: "Ponovi povedi in vadi izgovorjavo glasov na začetku, na sredini in na koncu.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_1.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "85%"
  },
  {
    id: "met-kocke",
    title: "SMEŠNE POVEDI",
    description: "Sestavi smešne povedi in vadi izgovorjavo z glasovi na začetku, sredini in koncu besed",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Smesne_besede_21.webp",
    customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)",
    imageScale: "90%"
  },
];

export default function AdminGovorneIgre() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  const handleGameClick = (gameId: string) => {
    navigate(`/admin/children/${childId}/games/${gameId}`);
  };

  return (
    <AdminGameWrapper 
      title="Govorne igre"
      backPath={`/admin/children/${childId}/workspace`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {games.map((game) => (
          <div key={game.id} className="flex h-full">
            <div
              className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col w-full"
              onClick={() => handleGameClick(game.id)}
            >
              {/* Card Image */}
              <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
                {game.customBackground && (
                  <div 
                    className="absolute inset-0"
                    style={{ background: game.customBackground }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img 
                    src={game.image}
                    alt={game.title}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                    style={{
                      maxWidth: game.imageScale || "90%",
                      maxHeight: game.imageScale || "90%",
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
    </AdminGameWrapper>
  );
}
