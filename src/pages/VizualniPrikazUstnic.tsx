import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  },
  {
    id: "glas-l",
    title: "Glas L",
    sounds: ["L"],
    image: `${STORAGE_BASE}/Glas_L.png`,
    audioUrl: null as string | null,
  },
  {
    id: "glas-r",
    title: "Glas R",
    sounds: ["R"],
    image: `${STORAGE_BASE}/Glas_R.png`,
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z",
    title: "Glasovi C, S, Z",
    sounds: ["C", "S", "Z"],
    image: `${STORAGE_BASE}/Glas_SZC.png`,
    audioUrl: null as string | null,
  },
  {
    id: "glas-c-s-z-stresnicki",
    title: "Glasovi Č, Š, Ž",
    sounds: ["Č", "Š", "Ž"],
    image: `${STORAGE_BASE}/Glas_ShZhCh.png`,
    audioUrl: null as string | null,
  },
];

const navButtons = [
  { label: "K", index: 0 },
  { label: "L", index: 1 },
  { label: "R", index: 2 },
];
const navButtons2 = [
  { label: "C, S, Z", index: 3 },
  { label: "Č, Š, Ž", index: 4 },
];

const VizualniPrikazUstnic = () => {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
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

  const api = carouselApi;
  const slide = currentSlide;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Vizualni prikaz ustnic
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground text-lg">
            Poglej kako so ustnice postavljene pri izgovorjavi posameznega glasu
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {selectedChild ? (
          <>
            {/* Navigation buttons */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="flex gap-2">
                {navButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => api?.scrollTo(btn.index)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold border-2 border-foreground transition-all",
                      slide === btn.index
                        ? "bg-foreground text-white"
                        : "bg-white text-foreground hover:bg-foreground/10"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {navButtons2.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => api?.scrollTo(btn.index)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold border-2 border-foreground transition-all",
                      slide === btn.index
                        ? "bg-foreground text-white"
                        : "bg-white text-foreground hover:bg-foreground/10"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel */}
            <div className={cn("w-full mx-auto", isMobile ? "" : "max-w-xl")}>
              <Carousel
                setApi={setCarouselApi}
                className="w-full"
                opts={{ align: "center", loop: false }}
              >
                <CarouselContent className={isMobile ? "" : "-ml-0"}>
                  {soundCards.map((card) => {
                    const isFlipped = flippedCardId === card.id;
                    const cardHeight = isMobile ? '420px' : '525px';
                    return (
                      <CarouselItem key={card.id} className={cn(isMobile ? "basis-full flex justify-center" : "pl-0 basis-full flex justify-center")}>
                        <div className={cn("p-1", isMobile ? "w-full max-w-sm" : "w-full")}>
                          <div
                            className="flip-card cursor-pointer rounded-xl border-2 border-foreground bg-white transition-all duration-300"
                            style={{ minHeight: cardHeight }}
                            onClick={() => handleCardClick(card.id)}
                          >
                            <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: cardHeight }}>
                              <div className="flip-card-front flex-col p-0 overflow-hidden rounded-xl">
                                <div className="w-full flex-1 bg-gradient-to-br from-muted/40 to-muted/20 flex flex-col items-center justify-center gap-1">
                                  <span className="text-sm font-bold text-muted-foreground opacity-80 uppercase tracking-widest">Glas</span>
                                  <span className="text-5xl md:text-6xl font-black text-foreground drop-shadow-sm">{card.sounds.join(", ")}</span>
                                </div>
                                <div className="w-full bg-white py-3 px-2 flex items-center justify-center border-t border-border">
                                  <span className="text-base font-bold text-foreground text-center leading-tight">Odpri</span>
                                </div>
                              </div>
                              <div className="flip-card-back flex-col p-4 justify-between rounded-xl border-2 border-foreground bg-white">
                                <h3 className="text-lg font-bold text-foreground text-center">{card.title}</h3>
                                <img src={card.image} alt={card.title} className={cn("w-full object-contain rounded-lg", isMobile ? "max-h-[250px]" : "max-h-[312px]")} loading="lazy" />
                                <Button variant="outline" size="sm" className="w-full gap-2" disabled={!card.audioUrl} onClick={(e) => { e.stopPropagation(); }}>
                                  <Volume2 className="w-4 h-4" />
                                  {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                                </Button>
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
                    <CarouselPrevious className="h-16 w-16 bg-foreground text-white border-foreground hover:bg-foreground/80 hover:text-white [&>svg]:h-8 [&>svg]:w-8 [&>svg]:stroke-[3]" />
                    <CarouselNext className="h-16 w-16 bg-foreground text-white border-foreground hover:bg-foreground/80 hover:text-white [&>svg]:h-8 [&>svg]:w-8 [&>svg]:stroke-[3]" />
                  </>
                )}
              </Carousel>

              {/* Pagination dots */}
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
                        ? "w-3 h-3 bg-foreground shadow-sm"
                        : "w-2.5 h-2.5 bg-muted-foreground/40"
                    )} />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <p className="text-lg text-destructive">
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
