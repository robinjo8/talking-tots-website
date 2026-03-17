// Letter selection page for Kolo sreče games
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllWheelConfigs } from "@/data/artikulacijaVajeConfig";

// Letter card data for Kolo sreče (wheel games - začetek)
const wheelLetters = [
  { id: "c", letter: "C", title: "Glas C", description: "Zavrti kolo besed in vadi izgovorjavo glasu C na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png", path: "/govorne-igre/kolo-srece/c" },
  { id: "ch", letter: "Č", title: "Glas Č", description: "Zavrti kolo besed in vadi izgovorjavo glasu Č na začetku besed", gradient: "from-app-blue/20 to-app-teal/20", image: "zmajcek_crka_CH.png", path: "/govorne-igre/kolo-srece/ch" },
  { id: "k", letter: "K", title: "Glas K", description: "Zavrti kolo besed in vadi izgovorjavo glasu K na začetku besed", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_K.png", path: "/govorne-igre/kolo-srece/k" },
  { id: "l", letter: "L", title: "Glas L", description: "Zavrti kolo besed in vadi izgovorjavo glasu L na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_L.png", path: "/govorne-igre/kolo-srece/l" },
  { id: "r-zacetek", letter: "R", title: "Glas R - začetne vaje", description: "Zavrti kolo besed in vadi izgovorjavo glasu R z začetnimi vajami", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png", path: "/govorne-igre/kolo-srece/r-zacetek" },
  { id: "r", letter: "R", title: "Glas R", description: "Zavrti kolo besed in vadi izgovorjavo glasu R na začetku besed", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png", path: "/govorne-igre/kolo-srece/r" },
  { id: "s", letter: "S", title: "Glas S", description: "Zavrti kolo besed in vadi izgovorjavo glasu S na začetku besed", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_S.png", path: "/govorne-igre/kolo-srece/s" },
  { id: "sh", letter: "Š", title: "Glas Š", description: "Zavrti kolo besed in vadi izgovorjavo glasu Š na začetku besed", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_SH.png", path: "/govorne-igre/kolo-srece/sh" },
  { id: "z", letter: "Z", title: "Glas Z", description: "Zavrti kolo besed in vadi izgovorjavo glasu Z na začetku besed", gradient: "from-app-teal/20 to-dragon-green/20", image: "zmajcek_crka_Z.png", path: "/govorne-igre/kolo-srece/z" },
  { id: "zh", letter: "Ž", title: "Glas Ž", description: "Zavrti kolo besed in vadi izgovorjavo glasu Ž na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_ZH.png", path: "/govorne-igre/kolo-srece/zh" },
];

export default function KoloSreceGames() {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (path: string) => {
    navigate(path);
  };

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Back Button */}
      {isMobile && (
        <button
          onClick={() => navigate("/govorne-igre")}
          className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
      )}
      
      {/* Hero section */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kolo besed
            </h1>
            <p className="text-xl text-white/90">
              Izberi glas in zavrti kolo besed!
            </p>
          </div>
          
          <DailyStarsBar />
        </div>
      </section>
      
      {/* Content section */}
      <section className="py-4 md:py-12 bg-white min-h-screen" style={{ backgroundColor: 'white' }}>
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="hidden md:block mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <div className={isMobile ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
              {wheelLetters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLetterClick(item.path)}
                  className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Card Image */}
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

                  {/* Card Content */}
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
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-red-500">
                Prosimo, dodajte profil otroka v nastavitvah.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}
