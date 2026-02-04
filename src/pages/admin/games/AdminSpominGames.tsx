import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const memoryGames = [
  { 
    id: "spomin-c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poišči pare slik s črko C in nato ponovi besedo",
  },
  { 
    id: "spomin-ch",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poišči pare slik s črko Č in nato ponovi besedo",
  },
  { 
    id: "spomin-k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poišči pare slik s črko K in nato ponovi besedo",
  },
  { 
    id: "spomin-l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poišči pare slik s črko L in nato ponovi besedo",
  },
  { 
    id: "spomin-r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poišči pare slik s črko R in nato ponovi besedo",
  },
  { 
    id: "spomin-s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poišči pare slik s črko S in nato ponovi besedo",
  },
  { 
    id: "spomin-sh",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poišči pare slik s črko Š in nato ponovi besedo",
  },
  { 
    id: "spomin-z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poišči pare slik s črko Z in nato ponovi besedo",
  },
  { 
    id: "spomin-zh",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poišči pare slik s črko Ž in nato ponovi besedo",
  },
];

export default function AdminSpominGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  const handleLetterClick = (gameId: string) => {
    navigate(`/admin/children/${childId}/games/spomin/${gameId}`);
  };

  return (
    <AdminGameWrapper 
      title="Spomin - izberi črko"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {memoryGames.map((game) => (
          <div
            key={game.id}
            className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
            onClick={() => handleLetterClick(game.id)}
          >
            {/* Card Image */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={game.image}
                  alt={`Glas ${game.letter}`}
                  className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'}`}
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>

            {/* Card Content */}
            <div className={`p-4 ${isMobile ? 'text-center' : ''}`}>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-app-blue transition-colors">
                Glas {game.letter}
              </h3>
              {!isMobile && (
                <p className="text-sm text-muted-foreground line-clamp-2">
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
