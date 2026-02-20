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

const gameLetters = [
  {
    id: "s",
    title: "Glas S",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu S na sredini in koncu besed",
    image: "zmajcek_crka_S.png",
    path: "/govorne-igre/kace/s",
    gradient: "radial-gradient(ellipse at center, hsl(142, 60%, 95%) 0%, hsl(142, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)",
    available: true,
  },
  {
    id: "z",
    title: "Glas Z",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu Z na sredini in koncu besed",
    image: "zmajcek_crka_Z.png",
    path: "/govorne-igre/kace/z",
    gradient: "radial-gradient(ellipse at center, hsl(174, 60%, 95%) 0%, hsl(174, 50%, 88%) 30%, hsl(142, 45%, 78%) 60%, hsl(142, 40%, 68%) 100%)",
    available: true,
  },
  {
    id: "c",
    title: "Glas C",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu C na sredini in koncu besed",
    image: "zmajcek_crka_C.png",
    path: "/govorne-igre/kace/c",
    gradient: "radial-gradient(ellipse at center, hsl(142, 60%, 95%) 0%, hsl(142, 50%, 88%) 30%, hsl(142, 45%, 78%) 60%, hsl(142, 40%, 68%) 100%)",
    available: true,
  },
  {
    id: "sh",
    title: "Glas Š",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu Š na sredini in koncu besed",
    image: "zmajcek_crka_SH.png",
    path: "/govorne-igre/kace/sh",
    gradient: "radial-gradient(ellipse at center, hsl(213, 60%, 95%) 0%, hsl(213, 50%, 88%) 30%, hsl(271, 45%, 78%) 60%, hsl(271, 40%, 68%) 100%)",
    available: false,
  },
  {
    id: "zh",
    title: "Glas Ž",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu Ž na sredini in koncu besed",
    image: "zmajcek_crka_ZH.png",
    path: "/govorne-igre/kace/zh",
    gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(213, 45%, 78%) 60%, hsl(213, 40%, 68%) 100%)",
    available: false,
  },
  {
    id: "ch",
    title: "Glas Č",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu Č na sredini in koncu besed",
    image: "zmajcek_crka_CH.png",
    path: "/govorne-igre/kace/ch",
    gradient: "radial-gradient(ellipse at center, hsl(213, 60%, 95%) 0%, hsl(213, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)",
    available: false,
  },
  {
    id: "k",
    title: "Glas K",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu K na sredini in koncu besed",
    image: "zmajcek_crka_K.png",
    path: "/govorne-igre/kace/k",
    gradient: "radial-gradient(ellipse at center, hsl(38, 100%, 95%) 0%, hsl(38, 90%, 88%) 30%, hsl(45, 85%, 78%) 60%, hsl(45, 80%, 68%) 100%)",
    available: false,
  },
  {
    id: "l",
    title: "Glas L",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu L na sredini in koncu besed",
    image: "zmajcek_crka_L.png",
    path: "/govorne-igre/kace/l",
    gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(213, 45%, 78%) 60%, hsl(213, 40%, 68%) 100%)",
    available: false,
  },
  {
    id: "r",
    title: "Glas R",
    description: "Igraj zabavno pot in vadi izgovorjavo glasu R na sredini in koncu besed",
    image: "zmajcek_crka_R.png",
    path: "/govorne-igre/kace/r",
    gradient: "radial-gradient(ellipse at center, hsl(271, 60%, 95%) 0%, hsl(271, 50%, 88%) 30%, hsl(174, 45%, 78%) 60%, hsl(174, 40%, 68%) 100%)",
    available: false,
  },
];

export default function KaceLestveGames() {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/login");
  }, [user, isAuthLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      toast.error("Napaka pri odjavi");
    }
  };

  if (isAuthLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isMobile && (
        <Button
          onClick={() => navigate("/govorne-igre")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      )}

      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Zabavna pot</h1>
            <p className="text-xl text-white/90">Izberi glas in igraj!</p>
          </div>
          <DailyStarsBar />
        </div>
      </section>

      <section className="py-12 bg-white min-h-screen">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>

          {selectedChild ? (
            <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
              {gameLetters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.available ? navigate(item.path) : undefined}
                  className={`bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden group transition-all duration-300 ${item.available ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
                    <div
                      className="absolute inset-0"
                      style={{ background: item.gradient }}
                    />
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                  </div>
                  <div className={isMobile ? "p-3 flex flex-col" : "p-6 flex flex-col"}>
                    <h3 className={isMobile ? "text-base font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors text-center" : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors"}>
                      {item.title}
                    </h3>
                    {!isMobile && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.available ? item.description : "Kmalu na voljo"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-destructive">Prosimo, dodajte profil otroka v nastavitvah.</p>
            </div>
          )}
        </div>
      </section>

      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}
