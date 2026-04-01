import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { useLogopedistChild } from "@/hooks/useLogopedistChildren";
import { getAgeGroup } from "@/utils/ageUtils";

const drsnaSestavljankaLetters = [
  { id: "c", letter: "C", title: "Glas C", description: "Drsna igra z glasom C in nato glasno ponovi besedo", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png" },
  { id: "ch", letter: "Č", title: "Glas Č", description: "Drsna igra z glasom Č in nato glasno ponovi besedo", gradient: "from-app-blue/20 to-app-teal/20", image: "zmajcek_crka_CH.png" },
  { id: "f", letter: "F", title: "Glas F", description: "Drsna igra z glasom F in nato glasno ponovi besedo", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_F.webp" },
  { id: "g", letter: "G", title: "Glas G", description: "Drsna igra z glasom G in nato glasno ponovi besedo", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_G.webp" },
  { id: "h", letter: "H", title: "Glas H", description: "Drsna igra z glasom H in nato glasno ponovi besedo", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_H.webp" },
  { id: "k", letter: "K", title: "Glas K", description: "Drsna igra z glasom K in nato glasno ponovi besedo", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_K.png" },
  { id: "l", letter: "L", title: "Glas L", description: "Drsna igra z glasom L in nato glasno ponovi besedo", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_L.png" },
  { id: "r-zacetek", letter: "R", title: "Glas R - začetne vaje", description: "Drsna igra z glasom R in nato glasno ponovi besedo - začetne vaje", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "r", letter: "R", title: "Glas R", description: "Drsna igra z glasom R in nato glasno ponovi besedo", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png" },
  { id: "s", letter: "S", title: "Glas S", description: "Drsna igra z glasom S in nato glasno ponovi besedo", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_S.png" },
  { id: "sh", letter: "Š", title: "Glas Š", description: "Drsna igra z glasom Š in nato glasno ponovi besedo", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_SH.png" },
  { id: "v", letter: "V", title: "Glas V", description: "Drsna igra z glasom V in nato glasno ponovi besedo", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_V.webp" },
  { id: "z", letter: "Z", title: "Glas Z", description: "Drsna igra z glasom Z in nato glasno ponovi besedo", gradient: "from-app-teal/20 to-dragon-green/20", image: "zmajcek_crka_Z.png" },
  { id: "zh", letter: "Ž", title: "Glas Ž", description: "Drsna igra z glasom Ž in nato glasno ponovi besedo", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_ZH.png" },
];

export default function AdminDrsnaSestavljankaGames() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const isMobile = useIsMobile();
  const { data: child } = useLogopedistChild(childId);

  const getAgeSuffix = (): string => {
    if (!child?.age) return '';
    const ageGroup = getAgeGroup(child.age);
    const suffixMap: Record<string, string> = { '3-4': '', '5-6': '56', '7-8': '78', '9-10': '910' };
    return suffixMap[ageGroup] || '';
  };

  const handleLetterClick = (letterId: string) => {
    const suffix = getAgeSuffix();
    navigate(`/admin/children/${childId}/games/drsna-sestavljanka/${letterId}${suffix}`);
  };

  return (
    <AdminGameWrapper 
      title="Drsna igra - izberi glas"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {drsnaSestavljankaLetters.map((item) => (
          <div
            key={item.id}
            onClick={() => handleLetterClick(item.id)}
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
