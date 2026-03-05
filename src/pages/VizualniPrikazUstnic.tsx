import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo";

const soundCards = [
  {
    id: "glas-k",
    title: "Glas K",
    sounds: ["K"],
    image: `${STORAGE_BASE}/Glas_K.png`,
    color: "text-app-orange",
    gradient: "from-app-orange/20 to-app-yellow/20",
    textColor: "text-app-orange",
    audioUrl: null as string | null,
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    color: "text-app-purple",
    gradient: "from-app-purple/20 to-app-blue/20",
    textColor: "text-app-purple",
    audioUrl: null as string | null,
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    color: "text-app-purple",
    gradient: "from-app-purple/20 to-app-teal/20",
    textColor: "text-app-purple",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    color: "text-dragon-green",
    gradient: "from-dragon-green/20 to-app-teal/20",
    textColor: "text-dragon-green",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    color: "text-app-blue",
    gradient: "from-app-blue/20 to-app-purple/20",
    textColor: "text-app-blue",
    audioUrl: null as string | null,
  },
];

const VizualniPrikazUstnic = () => {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

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
      console.error("Error in VizualniPrikazUstnic handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleCardClick = (cardId: string) => {
    setFlippedCardId((prev) => (prev === cardId ? null : cardId));
  };

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Vizualni prikaz ustnic
            </h1>
            <p className="text-xl text-white/90">
              Poglej, kako pravilno postaviti ustnice pri izgovorjavi glasov
            </p>
          </div>
          <DailyStarsBar />
        </div>
      </section>

      <section className="py-12 bg-white min-h-screen" style={{ backgroundColor: 'white' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>

          {selectedChild ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soundCards.map((card) => {
                const isFlipped = flippedCardId === card.id;
                return (
                  <div
                    key={card.id}
                    className="flip-card cursor-pointer"
                    style={{ minHeight: '420px' }}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '420px' }}>
                      {/* Front */}
                      <div
                        className="flip-card-front flex-col p-0 overflow-hidden border-2 border-gray-100 shadow-lg"
                        style={{ background: 'white' }}
                      >
                        {/* Top gradient section */}
                        <div className={`w-full flex-1 bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center gap-1`}>
                          <span className={`text-sm font-bold ${card.textColor} opacity-80 uppercase tracking-widest`}>
                            Glas
                          </span>
                          <span className={`text-5xl md:text-6xl font-black ${card.textColor} drop-shadow-sm`}>
                            {card.sounds.join(", ")}
                          </span>
                        </div>
                        {/* Bottom white section */}
                        <div className="w-full bg-white py-3 px-2 flex items-center justify-center border-t border-gray-100">
                          <span className={`text-base font-bold ${card.textColor} text-center leading-tight`}>
                            Odpri
                          </span>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="flip-card-back flex-col p-4 justify-between">
                        <h3 className={`text-lg font-bold ${card.color} text-center`}>
                          {card.title}
                        </h3>
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full max-h-[250px] object-contain rounded-lg"
                          loading="lazy"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          disabled={!card.audioUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Volume2 className="w-4 h-4" />
                          {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default VizualniPrikazUstnic;
