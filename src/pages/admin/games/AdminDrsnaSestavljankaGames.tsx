import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const drsnaSestavljankaLetters = [
  { id: "c", letter: "C", description: "Drsna sestavljanka s črko C", image: "zmajcek_crka_C.png" },
  { id: "ch", letter: "Č", description: "Drsna sestavljanka s črko Č", image: "zmajcek_crka_CH.png" },
  { id: "k", letter: "K", description: "Drsna sestavljanka s črko K", image: "zmajcek_crka_K.png" },
  { id: "l", letter: "L", description: "Drsna sestavljanka s črko L", image: "zmajcek_crka_L.png" },
  { id: "r", letter: "R", description: "Drsna sestavljanka s črko R", image: "zmajcek_crka_R.png" },
  { id: "s", letter: "S", description: "Drsna sestavljanka s črko S", image: "zmajcek_crka_S.png" },
  { id: "sh", letter: "Š", description: "Drsna sestavljanka s črko Š", image: "zmajcek_crka_SH.png" },
  { id: "z", letter: "Z", description: "Drsna sestavljanka s črko Z", image: "zmajcek_crka_Z.png" },
  { id: "zh", letter: "Ž", description: "Drsna sestavljanka s črko Ž", image: "zmajcek_crka_ZH.png" },
];

export default function AdminDrsnaSestavljankaGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  const handleLetterClick = (letterId: string) => {
    navigate(`/admin/children/${childId}/games/drsna-sestavljanka/${letterId}`);
  };

  return (
    <AdminGameWrapper 
      title="Drsna igra - izberi črko"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {drsnaSestavljankaLetters.map((item) => (
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
                  alt={`Črka ${item.letter}`}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            <div className={isMobile ? "p-3 text-center" : "p-4"}>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Črka {item.letter}
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
