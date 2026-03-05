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
    color: "text-app-blue",
    frontBg: "linear-gradient(145deg, hsl(207, 90%, 54%), hsl(207, 90%, 44%))",
    frontBorder: "hsl(207, 90%, 54%)",
    audioUrl: null as string | null,
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    color: "text-app-purple",
    frontBg: "linear-gradient(145deg, hsl(291, 64%, 42%), hsl(291, 64%, 32%))",
    frontBorder: "hsl(291, 64%, 42%)",
    audioUrl: null as string | null,
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    color: "text-app-orange",
    frontBg: "linear-gradient(145deg, hsl(36, 100%, 50%), hsl(36, 100%, 40%))",
    frontBorder: "hsl(36, 100%, 50%)",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    color: "text-dragon-green",
    frontBg: "linear-gradient(145deg, hsl(122, 39%, 49%), hsl(122, 39%, 39%))",
    frontBorder: "hsl(122, 39%, 49%)",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    color: "text-app-teal",
    frontBg: "linear-gradient(145deg, hsl(174, 100%, 29%), hsl(174, 100%, 22%))",
    frontBorder: "hsl(174, 100%, 29%)",
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
                    style={{ aspectRatio: 'auto', minHeight: '320px' }}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '320px' }}>
                      {/* Front */}
                      <div
                        className="flip-card-front flex-col gap-3"
                        style={{
                          background: card.frontBg,
                          borderColor: card.frontBorder,
                          boxShadow: `0 4px 15px ${card.frontBorder}40`,
                        }}
                      >
                        <span className="text-4xl font-bold text-white drop-shadow-md">
                          {card.sounds.join(", ")}
                        </span>
                        <span className="text-lg font-semibold text-white/90">
                          {card.title}
                        </span>
                      </div>

                      {/* Back */}
                      <div className="flip-card-back flex-col p-3 gap-2">
                        <h3 className={`text-lg font-bold ${card.color} pt-1`}>
                          {card.title}
                        </h3>
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-auto rounded-lg"
                          loading="lazy"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 mt-1"
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
