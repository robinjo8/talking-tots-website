import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";

const STORAGE_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo";

const soundCards = [
  {
    id: "glas-k",
    title: "Glas K",
    sounds: ["K"],
    image: `${STORAGE_BASE}/Glas_K.png`,
    audioUrl: null as string | null,
    color: "bg-gradient-to-br from-app-purple to-app-purple/80",
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    audioUrl: null as string | null,
    color: "bg-gradient-to-br from-app-blue to-app-blue/80",
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    audioUrl: null as string | null,
    color: "bg-gradient-to-br from-app-orange to-app-orange/80",
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    audioUrl: null as string | null,
    color: "bg-gradient-to-br from-app-yellow to-app-yellow/80",
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    audioUrl: null as string | null,
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

  const cardHeight = isMobile ? 'auto' : '480px';

  return (
    <div className={cn(
      "bg-dragon-green",
      isMobile ? "fixed inset-0 overflow-hidden flex flex-col" : "min-h-screen"
    )}>
      <Header />

      <div className={cn(
        "container max-w-4xl mx-auto px-4",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Title Section */}
        <div className={cn("text-center", isMobile ? "mb-2" : "mb-8")}>
          <h1 className={cn(
            "font-bold text-white mb-2",
            isMobile ? "text-2xl" : "text-4xl md:text-5xl"
          )}>
            Vizualni prikaz ustnic
          </h1>
          {!isMobile && (
            <p className="text-white/80 text-lg mt-2">
              Poglej kako so ustnice postavljene pri izgovorjavi posameznega glasu
            </p>
          )}
        </div>

        {/* Mobile letter navigation buttons */}
        {isMobile && selectedChild && (
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {soundCards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => { carouselApi?.scrollTo(i); }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200",
                  i === currentSlide
                    ? "bg-white text-dragon-green shadow-sm"
                    : "bg-white/20 text-white"
                )}
              >
                {card.sounds.join(" ")}
              </button>
            ))}
          </div>
        )}

        {selectedChild ? (
          <div className={cn("w-full mx-auto", isMobile ? "flex-1 flex flex-col overflow-hidden" : "max-w-xl")}>
            <Carousel
              setApi={setCarouselApi}
              className={cn("w-full", isMobile && "flex-1")}
              opts={{ align: "center", loop: false }}
            >
              <CarouselContent className={isMobile ? "" : "-ml-0"}>
                {soundCards.map((card) => {
                  const isFlipped = flippedCardId === card.id;
                  return (
                     <CarouselItem key={card.id} className={cn(isMobile ? "basis-full flex justify-center" : "pl-0 basis-full flex justify-center")}>
                      <div className={cn("p-1", isMobile ? "w-full max-w-sm" : "w-full")}>
                        <div
                          className={cn(
                            "flip-card rounded-xl bg-background shadow-md transition-all duration-300 border-0",
                            !isMobile && "cursor-pointer"
                          )}
                          style={{ minHeight: cardHeight }}
                          onClick={() => !isMobile && handleCardClick(card.id)}
                        >
                          <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: isMobile ? undefined : cardHeight }}>
                            {/* Front */}
                            <div className={cn(
                              "flip-card-front flex-col overflow-hidden rounded-xl bg-background",
                              isMobile ? "p-5" : "p-6 md:p-8"
                            )}>
                              <div className={cn(
                                "w-full flex flex-col items-center gap-3",
                                !isMobile && "flex-1 justify-center gap-4"
                              )}>
                                <div className={cn(
                                  "rounded-2xl flex items-center justify-center shadow-md",
                                  card.color,
                                  card.sounds.length > 1
                                    ? (isMobile ? "px-5 py-3 min-w-[140px]" : "px-8 py-5 min-w-[200px] h-24")
                                    : (isMobile ? "w-16 h-16" : "w-24 h-24")
                                )}>
                                  <span className={cn(
                                    "font-black text-white whitespace-nowrap",
                                    isMobile ? "text-2xl" : "text-4xl"
                                  )}>
                                    {card.sounds.join(", ")}
                                  </span>
                                </div>
                                <p className={cn(
                                  "font-bold text-foreground",
                                  isMobile ? "text-base" : "text-2xl"
                                )}>
                                  {card.title}
                                </p>
                                {isMobile && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 gap-2"
                                    onClick={(e) => { e.stopPropagation(); handleCardClick(card.id); }}
                                  >
                                    PRIKAŽI SLIKO
                                  </Button>
                                )}
                              </div>
                            </div>
                            {/* Back */}
                            <div className={cn(
                              "flip-card-back flex-col justify-between rounded-xl bg-background shadow-md",
                              isMobile ? "p-4" : "p-4 md:p-6"
                            )}>
                              <h3 className="text-lg font-bold text-foreground text-center">{card.title}</h3>
                              <img src={card.image} alt={card.title} className={cn("w-full object-contain rounded-lg", isMobile ? "max-h-[180px]" : "max-h-[280px]")} loading="lazy" />
                              <div className="flex gap-2 w-full">
                                <Button variant="outline" size="sm" className="flex-1 gap-2" disabled={!card.audioUrl} onClick={(e) => { e.stopPropagation(); }}>
                                  <Volume2 className="w-4 h-4" />
                                  {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                                </Button>
                                {isMobile && (
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleCardClick(card.id); }}>
                                    Nazaj
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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

            {/* Pagination dots */}
            <div className={cn("flex justify-center gap-2", isMobile ? "mt-2" : "mt-6")}>
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
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <p className="text-lg text-white">
              Prosimo, dodajte profil otroka v nastavitvah.
            </p>
          </div>
        )}
      </div>

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
