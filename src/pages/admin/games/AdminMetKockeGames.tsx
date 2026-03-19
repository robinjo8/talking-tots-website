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
      <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {metKockeLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/admin/children/${childId}/games/met-kocke/${item.id}`)}
            className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${isMobile ? 'aspect-[4/3]' : 'aspect-video'}`}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={`${SUPABASE_URL}/zmajcki/${letterToImage[item.id] || 'zmajcek_crka_R.png'}`}
                  alt={item.title}
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
                {item.title}
              </h3>
              {!isMobile && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
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
