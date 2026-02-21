import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";

const GovornojezicovneVaje = () => {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

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
  const exerciseTypes = [{
    id: "vaje-motorike-govoril",
    title: "VAJE MOTORIKE GOVORIL",
    description: "Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti. Vaje so pomembne za izboljšanje motorike ust, ki z ostalimi deli govornega aparata oblikuje posamezne glasove ter seveda sam govor. Vaje motorike govoril niso pogoj za pojav govora in ne uporabljamo jih pri terapiji vseh govorno-jezikovnih motenj.",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/vaje-motorike-govoril",
    example: "",
    available: true
  }, {
    id: "moji-prvi-glasovi",
    title: "MOJI PRVI GLASOVI",
    description: "Zabavna animacija, ki otroke uči prepoznavati in posnemati glasove. Barviti liki in interaktivni prizori spodbujajo poslušanje, ponavljanje in igro z glasovi, kar krepi govor in fonološke sposobnosti.",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/artikulacija",
    example: "",
    available: true
  }, {
    id: "video-navodila",
    title: "VIDEO NAVODILA",
    description: "Video navodila logopeda za pravilno izgovorjavo posameznih glasov. Kratki posnetki prikazujejo položaj govoril in tehniko izgovorjave.",
    color: "text-app-teal",
    gradient: "from-app-teal/10 to-dragon-green/10",
    path: "/video-navodila",
    example: "",
    available: true
  }];
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
        className="py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exerciseTypes.map(exercise => (
                <div key={exercise.id} className="flex h-full">
                  <div
                    className={cn(
                      "bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group flex flex-col w-full",
                      exercise.available 
                        ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" 
                        : "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => exercise.available && navigate(exercise.path)}
                  >
                    {/* Card Header with gradient */}
                    <div className={`relative bg-gradient-to-br ${exercise.gradient} p-6 flex items-center justify-center min-h-[120px]`}>
                      {!exercise.available && (
                        <div className="absolute top-4 right-4 bg-muted text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Kmalu
                        </div>
                      )}
                      <h3 className={`text-xl font-bold text-center ${exercise.color} px-4`}>
                        {exercise.title}
                      </h3>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {exercise.description}
                      </p>
                      {exercise.example && (
                        <p className="text-sm text-muted-foreground/80 italic">
                          {exercise.example}
                        </p>
                      )}
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
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
};
export default GovornojezicovneVaje;