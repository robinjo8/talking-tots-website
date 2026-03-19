import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const memoryGames = [
  { id: "spomin-c", letter: "C", title: "Glas C", description: "Poišči pare slik z glasom C in nato ponovi besedo", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png" },
  { id: "spomin-ch", letter: "Č", title: "Glas Č", description: "Poišči pare slik z glasom Č in nato ponovi besedo", gradient: "from-app-blue/20 to-app-teal/20", image: "zmajcek_crka_CH.png" },
  { id: "spomin-k", letter: "K", title: "Glas K", description: "Poišči pare slik z glasom K in nato ponovi besedo", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_K.png" },
  { id: "spomin-l", letter: "L", title: "Glas L", description: "Poišči pare slik z glasom L in nato ponovi besedo", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_L.png" },
  { id: "spomin-r-zacetek", letter: "R", title: "Glas R - začetne vaje", description: "Poišči pare slik z glasom R in nato ponovi besedo - začetne vaje", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "spomin-r", letter: "R", title: "Glas R", description: "Poišči pare slik z glasom R in nato ponovi besedo", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "spomin-s", letter: "S", title: "Glas S", description: "Poišči pare slik z glasom S in nato ponovi besedo", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_S.png" },
  { id: "spomin-sh", letter: "Š", title: "Glas Š", description: "Poišči pare slik z glasom Š in nato ponovi besedo", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_SH.png" },
  { id: "spomin-z", letter: "Z", title: "Glas Z", description: "Poišči pare slik z glasom Z in nato ponovi besedo", gradient: "from-app-teal/20 to-dragon-green/20", image: "zmajcek_crka_Z.png" },
  { id: "spomin-zh", letter: "Ž", title: "Glas Ž", description: "Poišči pare slik z glasom Ž in nato ponovi besedo", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_ZH.png" },
];

export default function AdminSpominGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  return (
    <AdminGameWrapper 
      title="Spomin - izberi glas"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {memoryGames.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/admin/children/${childId}/games/spomin/${game.id}`)}
            className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} ${isMobile ? 'aspect-[4/3]' : 'aspect-video'}`}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${game.image}`}
                  alt={game.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            <div className={isMobile ? "p-1.5 text-center" : "p-6 flex flex-col flex-grow"}>
              <h3 className={isMobile 
                ? "text-xs font-bold text-foreground group-hover:text-app-blue transition-colors leading-tight" 
                : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors"
              }>
                {game.title}
              </h3>
              {!isMobile && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {game.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminGameWrapper>
  );
}
