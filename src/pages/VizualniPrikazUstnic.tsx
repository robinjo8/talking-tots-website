import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo";

const soundCards = [
  {
    id: "glas-k",
    title: "Glas K",
    sounds: ["K"],
    image: `${STORAGE_BASE}/Glas_K.png`,
    gradient: "from-app-blue/10 to-app-purple/10",
    color: "text-app-blue",
    audioUrl: null as string | null,
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    gradient: "from-app-purple/10 to-app-blue/10",
    color: "text-app-purple",
    audioUrl: null as string | null,
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    gradient: "from-app-orange/10 to-app-yellow/10",
    color: "text-app-orange",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    gradient: "from-dragon-green/10 to-app-teal/10",
    color: "text-dragon-green",
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    gradient: "from-app-teal/10 to-dragon-green/10",
    color: "text-app-teal",
    audioUrl: null as string | null,
  },
];

const VizualniPrikazUstnic = () => {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<typeof soundCards[0] | null>(null);

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

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero sekcija */}
      <section className="bg-app-teal py-12 md:py-16 pt-24 md:pt-28">
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

      {/* Vsebina */}
      <section className="py-12 bg-white min-h-screen" style={{ backgroundColor: 'white' }}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>

          {selectedChild ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soundCards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
                  )}
                  onClick={() => setSelectedCard(card)}
                >
                  {/* Card Header */}
                  <div className={`relative bg-gradient-to-br ${card.gradient} p-4 flex items-center justify-center min-h-[80px]`}>
                    <h3 className={`text-lg font-bold text-center ${card.color}`}>
                      {card.title}
                    </h3>
                  </div>

                  {/* Card Image */}
                  <div className="p-4">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* Audio button */}
                  <div className="px-4 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      disabled={!card.audioUrl}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Audio playback will be added later
                      }}
                    >
                      <Volume2 className="w-4 h-4" />
                      {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                    </Button>
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

      {/* Dialog za povečano sliko */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className={`text-xl font-bold ${selectedCard?.color || ''}`}>
            {selectedCard?.title}
          </DialogTitle>
          {selectedCard && (
            <div className="space-y-4">
              <img
                src={selectedCard.image}
                alt={selectedCard.title}
                className="w-full h-auto rounded-lg"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                disabled={!selectedCard.audioUrl}
                onClick={() => {
                  // Audio playback will be added later
                }}
              >
                <Volume2 className="w-4 h-4" />
                {selectedCard.audioUrl ? "Poslušaj zvočna navodila" : "Zvočna navodila – kmalu"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
};

export default VizualniPrikazUstnic;
