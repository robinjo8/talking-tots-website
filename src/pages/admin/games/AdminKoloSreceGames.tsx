import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const wheelLetters = [
  { id: "c", letter: "C", title: "Črka C", description: "Zavrti kolo in vadi izgovorjavo črke C", image: "zmajcek_crka_C.png" },
  { id: "ch", letter: "Č", title: "Črka Č", description: "Zavrti kolo in vadi izgovorjavo črke Č", image: "zmajcek_crka_CH.png" },
  { id: "k", letter: "K", title: "Črka K", description: "Zavrti kolo in vadi izgovorjavo črke K", image: "zmajcek_crka_K.png" },
  { id: "l", letter: "L", title: "Črka L", description: "Zavrti kolo in vadi izgovorjavo črke L", image: "zmajcek_crka_L.png" },
  { id: "r", letter: "R", title: "Črka R", description: "Zavrti kolo in vadi izgovorjavo črke R", image: "zmajcek_crka_R.png" },
  { id: "s", letter: "S", title: "Črka S", description: "Zavrti kolo in vadi izgovorjavo črke S", image: "zmajcek_crka_S.png" },
  { id: "sh", letter: "Š", title: "Črka Š", description: "Zavrti kolo in vadi izgovorjavo črke Š", image: "zmajcek_crka_SH.png" },
  { id: "z", letter: "Z", title: "Črka Z", description: "Zavrti kolo in vadi izgovorjavo črke Z", image: "zmajcek_crka_Z.png" },
  { id: "zh", letter: "Ž", title: "Črka Ž", description: "Zavrti kolo in vadi izgovorjavo črke Ž", image: "zmajcek_crka_ZH.png" },
];

export default function AdminKoloSreceGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  const handleLetterClick = (letterId: string) => {
    navigate(`/admin/children/${childId}/games/kolo-srece/${letterId}`);
  };

  return (
    <AdminGameWrapper 
      title="Kolo besed - izberi črko"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {wheelLetters.map((item) => (
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
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            <div className={isMobile ? "p-3 text-center" : "p-4"}>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {item.title}
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
