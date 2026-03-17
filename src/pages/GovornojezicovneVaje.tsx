import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";
import { useIsMobile } from "@/hooks/use-mobile";

const GovornojezicovneVaje = () => {
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
      window.location.href = "/login";
    } catch (error) {
      console.error("Error in GovornojezicovneVaje handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  if (isAuthLoading || !user) {
    return null;
  }

  const exerciseTypes = [
    {
      id: "vaje-motorike-govoril",
      title: "VAJE MOTORIKE GOVORIL",
      mobileTitle: "VAJE MOTORIKE\nGOVORIL",
      description: "Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti.",
      path: "/govorno-jezikovne-vaje/vaje-motorike-govoril",
      image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje govoril.webp",
      imageScale: "90%",
      available: true,
    },
    {
      id: "moji-prvi-glasovi",
      title: "MOJI PRVI GLASOVI",
      mobileTitle: "MOJI PRVI\nGLASOVI",
      description: "Zabavna animacija, ki otroke uči prepoznavati in posnemati glasove. Barviti liki in interaktivni prizori spodbujajo poslušanje, ponavljanje in igro z glasovi.",
      path: "/govorno-jezikovne-vaje/artikulacija",
      image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajce_prvi glasovi.webp",
      imageScale: "90%",
      available: true,
    },
    {
      id: "vizualni-prikaz-ustnic",
      title: "VIZUALNI PRIKAZ USTNIC",
      mobileTitle: "VIZUALNI PRIKAZ\nUSTNIC",
      description: "Prikaz pravilnega položaja ustnic pri izgovorjavi določenega glasu. Otrok lahko s pomočjo slike lažje posnema gib ustnic pri glasovih C, Č, R, L, K, S, Š, Z in Ž.",
      path: "/govorno-jezikovne-vaje/vizualni-prikaz-ustnic",
      image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_ustnice.webp",
      imageScale: "90%",
      available: true,
    },
    {
      id: "video-navodila",
      title: "VIDEO NAVODILA",
      mobileTitle: "VIDEO\nNAVODILA",
      description: "Video navodila logopeda za pravilno izgovorjavo posameznih glasov. Kratki posnetki prikazujejo položaj govoril in tehniko izgovorjave.",
      path: "/video-navodila",
      image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_video navodila.webp",
      imageScale: "90%",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Govorne vaje
            </h1>
            <p className="text-xl text-white/90">
              Izberi vajo in se zabavaj pri učenju!
            </p>
          </div>
          
          <DailyStarsBar />
        </div>
      </section>
      
      {/* Bela sekcija z vajami */}
      <section 
        className="py-4 md:py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
              {exerciseTypes.map(exercise => (
                <div key={exercise.id} className="flex h-full">
                  <div
                    className={cn(
                      "bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col w-full",
                      !exercise.available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => exercise.available && navigate(exercise.path)}
                  >
                    {/* Card Image */}
                    <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
                      <div className="absolute inset-0 bg-white" />
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img 
                          src={exercise.image}
                          alt={exercise.title}
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                          style={{
                            maxWidth: exercise.imageScale || "90%",
                            maxHeight: exercise.imageScale || "90%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    {/* Card Content */}
                    <div className={isMobile ? "p-3 flex flex-col flex-grow" : "p-4 flex flex-col flex-grow"}>
                      <h3 className={isMobile 
                        ? "text-sm font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors text-center whitespace-pre-line" 
                        : "text-lg font-bold text-foreground mb-2 group-hover:text-app-blue transition-colors"
                      }>
                        {isMobile ? exercise.mobileTitle : exercise.title}
                      </h3>
                      <p className={isMobile 
                        ? "text-xs text-muted-foreground line-clamp-3"
                        : "text-sm text-muted-foreground leading-relaxed"
                      }>
                        {exercise.description}
                      </p>
                    </div>
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
      
      {/* Mobile Back Button */}
      {isMobile && (
        <Button
          onClick={() => navigate("/moje-aplikacije")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      )}
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
};
export default GovornojezicovneVaje;