import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const wheelLetters = [
  { id: "c", letter: "C", title: "Glas C", description: "Zavrti kolo besed in vadi izgovorjavo glasu C na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png" },
  { id: "ch", letter: "Č", title: "Glas Č", description: "Zavrti kolo besed in vadi izgovorjavo glasu Č na začetku besed", gradient: "from-app-blue/20 to-app-teal/20", image: "zmajcek_crka_CH.png" },
  { id: "f", letter: "F", title: "Glas F", description: "Zavrti kolo besed in vadi izgovorjavo glasu F na začetku besed", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_F.webp" },
  { id: "g", letter: "G", title: "Glas G", description: "Zavrti kolo besed in vadi izgovorjavo glasu G na začetku besed", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_G.webp" },
  { id: "h", letter: "H", title: "Glas H", description: "Zavrti kolo besed in vadi izgovorjavo glasu H na začetku besed", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_H.webp" },
  { id: "k", letter: "K", title: "Glas K", description: "Zavrti kolo besed in vadi izgovorjavo glasu K na začetku besed", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_K.png" },
  { id: "l", letter: "L", title: "Glas L", description: "Zavrti kolo besed in vadi izgovorjavo glasu L na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_L.png" },
  { id: "r-zacetek", letter: "R", title: "Glas R - začetne vaje", description: "Zavrti kolo besed in vadi izgovorjavo glasu R z začetnimi vajami", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "r", letter: "R", title: "Glas R", description: "Zavrti kolo besed in vadi izgovorjavo glasu R na začetku besed", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "s", letter: "S", title: "Glas S", description: "Zavrti kolo besed in vadi izgovorjavo glasu S na začetku besed", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_S.png" },
  { id: "sh", letter: "Š", title: "Glas Š", description: "Zavrti kolo besed in vadi izgovorjavo glasu Š na začetku besed", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_SH.png" },
  { id: "v", letter: "V", title: "Glas V", description: "Zavrti kolo besed in vadi izgovorjavo glasu V na začetku besed", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_V.webp" },
  { id: "z", letter: "Z", title: "Glas Z", description: "Zavrti kolo besed in vadi izgovorjavo glasu Z na začetku besed", gradient: "from-app-teal/20 to-dragon-green/20", image: "zmajcek_crka_Z.png" },
  { id: "zh", letter: "Ž", title: "Glas Ž", description: "Zavrti kolo besed in vadi izgovorjavo glasu Ž na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_ZH.png" },
];

export default function AdminKoloSreceGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();

  return (
    <AdminGameWrapper 
      title="Kolo besed - izberi glas"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {wheelLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/admin/children/${childId}/games/kolo-srece/${item.id}`)}
            className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${isMobile ? 'aspect-[4/3]' : 'aspect-video'}`}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${item.image}`}
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
