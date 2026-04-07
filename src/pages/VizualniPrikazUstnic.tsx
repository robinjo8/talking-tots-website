import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
const STORAGE_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo";
const AUDIO_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki";

const soundCards = [
  {
    id: "glas-k",
    title: "Glas K",
    sounds: ["K"],
    image: `${STORAGE_BASE}/Glas_K.png`,
    audioUrl: `${AUDIO_BASE}/Polozajust_karticaK.mp3`,
    color: "bg-gradient-to-br from-app-purple to-app-purple/80",
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    audioUrl: `${AUDIO_BASE}/Polozajust_karticaL.mp3`,
    color: "bg-gradient-to-br from-app-blue to-app-blue/80",
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    audioUrl: `${AUDIO_BASE}/Polozajust_karticaR.mp3`,
    color: "bg-gradient-to-br from-app-orange to-app-orange/80",
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    audioUrl: `${AUDIO_BASE}/Polozajust_SICNIKI.mp3`,
    color: "bg-gradient-to-br from-app-yellow to-app-yellow/80",
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    audioUrl: `${AUDIO_BASE}/Polozajust_SUMNIKI.mp3`,
    color: "bg-gradient-to-br from-app-red to-app-red/80 text-white",
  },
];

const VizualniPrikazUstnic = () => {
  const { user, selectedChild, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    setFlippedCardId(null);
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    onSelect();
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi, onSelect]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  const handleCardClick = (cardId: string) => {
    setFlippedCardId((prev) => (prev === cardId ? null : cardId));
  };

  if (isAuthLoading || !user) {
    return null;
  }

  const cardHeight = '480px';

  return (
    <div className={cn(
      "bg-dragon-green",
      isMobile ? "fixed inset-0 overflow-auto flex flex-col" : "min-h-screen"
    )}>
      <Header />

      <SubscriptionGate>
      <div className={cn(
        "container max-w-4xl mx-auto px-4",
        isMobile ? "flex-1 flex flex-col pt-20 pb-24" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Title Section */}
        <div className={cn("text-center", isMobile ? "mb-3" : "mb-6")}>
          <h1 className={cn(
            "font-bold text-white mb-2",
            isMobile ? "text-2xl" : "text-4xl md:text-5xl"
          )}>
            Vizualni prikaz govoril
          </h1>
          {!isMobile && (
            <p className="text-white/80 text-lg mt-2">
              Poglej kako so ustnice postavljene pri izgovorjavi posameznega glasu
            </p>
          )}
        </div>

        {/* Letter navigation buttons - all devices */}
        {selectedChild && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {soundCards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => { carouselApi?.scrollTo(i); }}
                className={cn(
                  "rounded-full px-4 py-1.5 font-bold transition-all duration-200",
                  isMobile ? "text-sm" : "text-base px-5 py-2",
                  i === currentSlide
                    ? "bg-white text-dragon-green shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                {card.sounds.join(" ")}
              </button>
            ))}
          </div>
        )}

        {selectedChild ? (
          <div className={cn("w-full mx-auto", isMobile ? "flex-1 flex items-center" : "max-w-xl")}>
            <Carousel
              setApi={setCarouselApi}
              className="w-full"
              opts={{ align: "center", loop: false }}
            >
              <CarouselContent className={isMobile ? "" : "-ml-0"}>
                {soundCards.map((card) => {
                  const isFlipped = flippedCardId === card.id;
                  return (
                    <CarouselItem key={card.id} className={cn(isMobile ? "basis-full flex justify-center" : "pl-0 basis-full flex justify-center")}>
                      <div className={cn("p-1", isMobile ? "w-full max-w-sm" : "w-full")}>
                        {isMobile ? (
                          /* Mobile: simple show/hide instead of flip */
                          <div className="rounded-xl bg-background shadow-md h-[400px] flex flex-col">
                            {!isFlipped ? (
                              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
                                <p className="font-bold text-foreground text-lg tracking-wide">GLAS</p>
                                <div className={cn(
                                  "rounded-2xl flex items-center justify-center shadow-md",
                                  card.color,
                                  card.sounds.length > 1
                                    ? "px-5 py-3 min-w-[140px]"
                                    : "w-16 h-16"
                                )}>
                                  <span className="font-black text-white whitespace-nowrap text-2xl">
                                    {card.sounds.join(", ")}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1"
                                  onClick={() => handleCardClick(card.id)}
                                >
                                  PRIKAŽI SLIKO
                                </Button>
                              </div>
                            ) : (
                              <div className="flex-1 flex flex-col items-center gap-3 p-4 overflow-hidden">
                                <img src={card.image} alt={card.title} className="w-full object-contain rounded-lg flex-1 min-h-0 max-h-[320px]" loading="lazy" onClick={() => handleCardClick(card.id)} />
                                <Button variant="outline" size="sm" className="w-full gap-2" disabled={!card.audioUrl}>
                                  <Volume2 className="w-4 h-4" />
                                  {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Desktop: same show/hide as mobile */
                          <div className="rounded-xl bg-background shadow-md" style={{ minHeight: cardHeight }}>
                            {!isFlipped ? (
                              <div className="flex flex-col items-center justify-center gap-4 p-8" style={{ minHeight: cardHeight }}>
                                <p className="font-bold text-foreground text-2xl tracking-wide">GLAS</p>
                                <div className={cn(
                                  "rounded-2xl flex items-center justify-center shadow-md",
                                  card.color,
                                  card.sounds.length > 1
                                    ? "px-8 py-5 min-w-[200px] h-24"
                                    : "w-24 h-24"
                                )}>
                                  <span className="font-black text-white whitespace-nowrap text-4xl">
                                    {card.sounds.join(", ")}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => handleCardClick(card.id)}
                                >
                                  PRIKAŽI SLIKO
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-4 p-6" style={{ minHeight: cardHeight }}>
                                <img src={card.image} alt={card.title} className="w-full object-contain rounded-lg flex-1 min-h-0 max-h-[360px] cursor-pointer" loading="lazy" onClick={() => handleCardClick(card.id)} />
                                <Button variant="outline" className="w-full gap-2" disabled={!card.audioUrl}>
                                  <Volume2 className="w-4 h-4" />
                                  {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {!isMobile && (
                <>
                  <CarouselPrevious className="bg-white text-dragon-green border-white hover:bg-white/90 hover:text-dragon-green" />
                  <CarouselNext className="bg-white text-dragon-green border-white hover:bg-white/90 hover:text-dragon-green" />
                </>
              )}
            </Carousel>

            {/* Pagination dots - desktop only */}
            {!isMobile && (
              <div className="flex justify-center gap-2 mt-6">
                {soundCards.map((_, i) => (
                  <button
                    key={i}
                    className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-transparent transition-all duration-300"
                    onClick={() => carouselApi?.scrollTo(i)}
                    aria-label={`Pojdi na kartico ${i + 1}`}
                  >
                    <span className={cn(
                      "rounded-full transition-all duration-300",
                      i === currentSlide
                        ? "w-3 h-3 bg-white shadow-sm"
                        : "w-2.5 h-2.5 bg-white/40"
                    )} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <p className="text-lg text-white">
              Prosimo, dodajte profil otroka v nastavitvah.
            </p>
          </div>
        )}
      </div>
      </SubscriptionGate>

      {/* Floating back button */}
      <button
        onClick={() => navigate("/govorno-jezikovne-vaje")}
        className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
      >
        <ArrowLeft className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};

export default VizualniPrikazUstnic;
