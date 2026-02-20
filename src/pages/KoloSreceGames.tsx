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
  { id: "s", letter: "S", title: "Glas S", description: "Zavrti kolo besed in vadi izgovorjavo glasu S na začetku besed", gradient: "from-dragon-green/20 to-app-teal/20", image: "zmajcek_crka_S.png", path: "/govorne-igre/kolo-srece/s" },
  { id: "z", letter: "Z", title: "Glas Z", description: "Zavrti kolo besed in vadi izgovorjavo glasu Z na začetku besed", gradient: "from-app-teal/20 to-dragon-green/20", image: "zmajcek_crka_Z.png", path: "/govorne-igre/kolo-srece/z" },
  { id: "c", letter: "C", title: "Glas C", description: "Zavrti kolo besed in vadi izgovorjavo glasu C na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png", path: "/govorne-igre/kolo-srece/c" },
  { id: "sh", letter: "Š", title: "Glas Š", description: "Zavrti kolo besed in vadi izgovorjavo glasu Š na začetku besed", gradient: "from-app-blue/20 to-app-purple/20", image: "zmajcek_crka_SH.png", path: "/govorne-igre/kolo-srece/sh" },
  { id: "zh", letter: "Ž", title: "Glas Ž", description: "Zavrti kolo besed in vadi izgovorjavo glasu Ž na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_ZH.png", path: "/govorne-igre/kolo-srece/zh" },
  { id: "ch", letter: "Č", title: "Glas Č", description: "Zavrti kolo besed in vadi izgovorjavo glasu Č na začetku besed", gradient: "from-app-blue/20 to-app-teal/20", image: "zmajcek_crka_CH.png", path: "/govorne-igre/kolo-srece/ch" },
  { id: "k", letter: "K", title: "Glas K", description: "Zavrti kolo besed in vadi izgovorjavo glasu K na začetku besed", gradient: "from-app-orange/20 to-app-yellow/20", image: "zmajcek_crka_K.png", path: "/govorne-igre/kolo-srece/k" },
  { id: "l", letter: "L", title: "Glas L", description: "Zavrti kolo besed in vadi izgovorjavo glasu L na začetku besed", gradient: "from-app-purple/20 to-app-blue/20", image: "zmajcek_crka_L.png", path: "/govorne-igre/kolo-srece/l" },
  { id: "r", letter: "R", title: "Glas R", description: "Zavrti kolo besed in vadi izgovorjavo glasu R na začetku besed", gradient: "from-app-purple/20 to-app-teal/20", image: "zmajcek_crka_R.png", path: "/govorne-igre/kolo-srece/r" },
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
        <Button
          onClick={() => navigate("/govorne-igre")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
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
      <section className="py-12 bg-white min-h-screen" style={{ backgroundColor: 'white' }}>
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
              {wheelLetters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLetterClick(item.path)}
                  className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Card Image */}
                  <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${item.image}`}
                        alt={item.title}
                        className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'}`}
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={isMobile ? "p-3 flex flex-col flex-grow" : "p-6 flex flex-col flex-grow"}>
                    <h3 className={isMobile 
                      ? "text-base font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors leading-tight text-center" 
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
