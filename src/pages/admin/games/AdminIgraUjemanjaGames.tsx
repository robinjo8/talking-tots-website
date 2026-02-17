import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const igraUjemanjaLetters = [
  { id: "s", letter: "S", description: "Poveži pare slik z glasom S", image: "zmajcek_crka_S.png" },
  { id: "z", letter: "Z", description: "Poveži pare slik z glasom Z", image: "zmajcek_crka_Z.png" },
  { id: "c", letter: "C", description: "Poveži pare slik z glasom C", image: "zmajcek_crka_C.png" },
  { id: "sh", letter: "Š", description: "Poveži pare slik z glasom Š", image: "zmajcek_crka_SH.png" },
  { id: "zh", letter: "Ž", description: "Poveži pare slik z glasom Ž", image: "zmajcek_crka_ZH.png" },
  { id: "ch", letter: "Č", description: "Poveži pare slik z glasom Č", image: "zmajcek_crka_CH.png" },
  { id: "k", letter: "K", description: "Poveži pare slik z glasom K", image: "zmajcek_crka_K.png" },
  { id: "l", letter: "L", description: "Poveži pare slik z glasom L", image: "zmajcek_crka_L.png" },
  { id: "r", letter: "R", description: "Poveži pare slik z glasom R", image: "zmajcek_crka_R.png" },
];

export default function AdminIgraUjemanjaGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  const handleLetterClick = (letterId: string) => {
    navigate(`/admin/children/${childId}/games/igra-ujemanja/${letterId}`);
  };

  return (
    <AdminGameWrapper 
      title="Igra ujemanja - izberi glas"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {igraUjemanjaLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => handleLetterClick(item.id)}
            className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-border"
          >
            <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)'
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${item.image}`}
                  alt={`Glas ${item.letter}`}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            <div className={isMobile ? "p-3 text-center" : "p-4"}>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Glas {item.letter}
              </h3>
              {!isMobile && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminGameWrapper>
  );
}
