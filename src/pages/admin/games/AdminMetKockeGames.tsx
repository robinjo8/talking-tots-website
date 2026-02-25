import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { metKockeLetters } from "@/data/metKockeConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

const letterToImage: Record<string, string> = {
  'c': 'zmajcek_crka_C.png',
  'ch': 'zmajcek_crka_CH.png',
  'k': 'zmajcek_crka_K.png',
  'l': 'zmajcek_crka_L.png',
  'r': 'zmajcek_crka_R.png',
  'r-zacetek': 'zmajcek_crka_R.png',
  's': 'zmajcek_crka_S.png',
  'sh': 'zmajcek_crka_SH.png',
  'z': 'zmajcek_crka_Z.png',
  'zh': 'zmajcek_crka_ZH.png',
};

export default function AdminMetKockeGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  return (
    <AdminGameWrapper 
      title="Smešne povedi - izberi glas"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {metKockeLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/admin/children/${childId}/games/met-kocke/${item.id}`)}
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
                  src={`${SUPABASE_URL}/zmajcki/${letterToImage[item.id] || 'zmajcek_crka_R.png'}`}
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
                  Vrzi kocko in sestavi smešne povedi z glasom {item.letter}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminGameWrapper>
  );
}
