// Letter selection page for Kolo sreče games
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Progress } from "@/components/ui/progress";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllWheelConfigs } from "@/data/artikulacijaVajeConfig";

// Letter card data for Kolo sreče (wheel games - začetek)
const wheelLetters = [
  { id: "c", letter: "C", title: "Črka C", description: "Zavrti kolo sreče in vadi izgovorjavo črke C na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_C.png", path: "/govorne-igre/kolo-srece/c" },
  { id: "ch", letter: "Č", title: "Črka Č", description: "Zavrti kolo sreče in vadi izgovorjavo črke Č na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_CH.png", path: "/govorne-igre/kolo-srece/ch" },
  { id: "k", letter: "K", title: "Črka K", description: "Zavrti kolo sreče in vadi izgovorjavo črke K na začetku besed", gradient: "from-app-yellow/20 to-app-yellow/20", image: "zmajcek_crka_K.png", path: "/govorne-igre/kolo-srece/k" },
  { id: "l", letter: "L", title: "Črka L", description: "Zavrti kolo sreče in vadi izgovorjavo črke L na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_L.png", path: "/govorne-igre/kolo-srece/l" },
  { id: "r", letter: "R", title: "Črka R", description: "Zavrti kolo sreče in vadi izgovorjavo črke R na začetku besed", gradient: "from-app-yellow/20 to-app-yellow/20", image: "zmajcek_crka_R.png", path: "/govorne-igre/kolo-srece/r" },
  { id: "s", letter: "S", title: "Črka S", description: "Zavrti kolo sreče in vadi izgovorjavo črke S na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_S.png", path: "/govorne-igre/kolo-srece/s" },
  { id: "sh", letter: "Š", title: "Črka Š", description: "Zavrti kolo sreče in vadi izgovorjavo črke Š na začetku besed", gradient: "from-app-yellow/20 to-app-yellow/20", image: "zmajcek_crka_SH.png", path: "/govorne-igre/kolo-srece/sh" },
  { id: "z", letter: "Z", title: "Črka Z", description: "Zavrti kolo sreče in vadi izgovorjavo črke Z na začetku besed", gradient: "from-dragon-green/20 to-dragon-green/20", image: "zmajcek_crka_Z.png", path: "/govorne-igre/kolo-srece/z" },
  { id: "zh", letter: "Ž", title: "Črka Ž", description: "Zavrti kolo sreče in vadi izgovorjavo črke Ž na začetku besed", gradient: "from-app-yellow/20 to-app-yellow/20", image: "zmajcek_crka_ZH.png", path: "/govorne-igre/kolo-srece/zh" },
];

export default function KoloSreceGames() {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { dailyActivities, isLoading } = useDailyProgress();
  const isMobile = useIsMobile();
  
  const targetActivities = 15;
  const percentage = Math.min((dailyActivities / targetActivities) * 100, 100);

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
              Kolo sreče
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko in zavrti kolo sreče!
            </p>
          </div>
          
          {selectedChild && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Tvoj dnevni napredek</span>
                  <span className="text-white font-bold text-sm">{dailyActivities}/{targetActivities} ⭐</span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-3 bg-white/20 [&>div]:bg-app-orange"
                />
              </div>
            </div>
          )}
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
