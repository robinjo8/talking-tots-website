import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const gameLetters = [
  { id: "c", title: "Glas C", description: "Igraj zabavno pot in vadi izgovorjavo glasu C na sredini in koncu besed", image: "zmajcek_crka_C.png", gradient: "radial-gradient(ellipse at center, hsl(142, 60%, 95%) 0%, hsl(142, 50%, 88%) 30%, hsl(142, 45%, 78%) 60%, hsl(142, 40%, 68%) 100%)" },
  { id: "ch", title: "Glas Č", description: "Igraj zabavno pot in vadi izgovorjavo glasu Č na sredini in koncu besed", image: "zmajcek_crka_CH.png", gradient: "radial-gradient(ellipse at center, hsl(213, 60%, 95%) 0%, hsl(213, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)" },
  { id: "f", title: "Glas F", description: "Igraj zabavno pot in vadi izgovorjavo glasu F na sredini in koncu besed", image: "zmajcek_crka_F.webp", gradient: "radial-gradient(ellipse at center, hsl(30, 80%, 95%) 0%, hsl(30, 70%, 88%) 30%, hsl(38, 65%, 78%) 60%, hsl(38, 60%, 68%) 100%)" },
  { id: "g", title: "Glas G", description: "Igraj zabavno pot in vadi izgovorjavo glasu G na sredini in koncu besed", image: "zmajcek_crka_G.webp", gradient: "radial-gradient(ellipse at center, hsl(200, 60%, 95%) 0%, hsl(200, 50%, 88%) 30%, hsl(210, 45%, 78%) 60%, hsl(210, 40%, 68%) 100%)" },
  { id: "h", title: "Glas H", description: "Igraj zabavno pot in vadi izgovorjavo glasu H na sredini in koncu besed", image: "zmajcek_crka_H.webp", gradient: "radial-gradient(ellipse at center, hsl(340, 60%, 95%) 0%, hsl(340, 50%, 88%) 30%, hsl(350, 45%, 78%) 60%, hsl(350, 40%, 68%) 100%)" },
  { id: "k", title: "Glas K", description: "Igraj zabavno pot in vadi izgovorjavo glasu K na sredini in koncu besed", image: "zmajcek_crka_K.png", gradient: "radial-gradient(ellipse at center, hsl(38, 100%, 95%) 0%, hsl(38, 90%, 88%) 30%, hsl(45, 85%, 78%) 60%, hsl(45, 80%, 68%) 100%)" },
  { id: "l", title: "Glas L", description: "Igraj zabavno pot in vadi izgovorjavo glasu L na sredini in koncu besed", image: "zmajcek_crka_L.png", gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(213, 45%, 78%) 60%, hsl(213, 40%, 68%) 100%)" },
  { id: "r-zacetek", title: "Glas R - začetne vaje", description: "Igraj zabavno pot in vadi izgovorjavo glasu R z začetnimi vajami", image: "zmajcek_crka_R.png", gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)" },
  { id: "r", title: "Glas R", description: "Igraj zabavno pot in vadi izgovorjavo glasu R na sredini in koncu besed", image: "zmajcek_crka_R.png", gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)" },
  { id: "s", title: "Glas S", description: "Igraj zabavno pot in vadi izgovorjavo glasu S na sredini in koncu besed", image: "zmajcek_crka_S.png", gradient: "radial-gradient(ellipse at center, hsl(142, 60%, 95%) 0%, hsl(142, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)" },
  { id: "sh", title: "Glas Š", description: "Igraj zabavno pot in vadi izgovorjavo glasu Š na sredini in koncu besed", image: "zmajcek_crka_SH.png", gradient: "radial-gradient(ellipse at center, hsl(213, 60%, 95%) 0%, hsl(213, 50%, 88%) 30%, hsl(271, 45%, 78%) 60%, hsl(271, 40%, 68%) 100%)" },
  { id: "v", title: "Glas V", description: "Igraj zabavno pot in vadi izgovorjavo glasu V na sredini in koncu besed", image: "zmajcek_crka_V.webp", gradient: "radial-gradient(ellipse at center, hsl(160, 60%, 95%) 0%, hsl(160, 50%, 88%) 30%, hsl(170, 45%, 78%) 60%, hsl(170, 40%, 68%) 100%)" },
  { id: "z", title: "Glas Z", description: "Igraj zabavno pot in vadi izgovorjavo glasu Z na sredini in koncu besed", image: "zmajcek_crka_Z.png", gradient: "radial-gradient(ellipse at center, hsl(174, 60%, 95%) 0%, hsl(174, 50%, 88%) 30%, hsl(142, 45%, 78%) 60%, hsl(142, 40%, 68%) 100%)" },
  { id: "zh", title: "Glas Ž", description: "Igraj zabavno pot in vadi izgovorjavo glasu Ž na sredini in koncu besed", image: "zmajcek_crka_ZH.png", gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(213, 45%, 78%) 60%, hsl(213, 40%, 68%) 100%)" },
];

export default function AdminKaceLestveGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  return (
    <AdminGameWrapper title="Zabavna pot - izberi glas" backPath={`/admin/children/${childId}/games`}>
      <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {gameLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/admin/children/${childId}/games/kace/${item.id}`)}
            className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className={isMobile ? "relative aspect-[4/3] overflow-hidden" : "relative aspect-video overflow-hidden"}>
              <div className="absolute inset-0" style={{ background: item.gradient }} />
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ mixBlendMode: "multiply" }}
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
