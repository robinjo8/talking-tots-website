import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CarouselNavigation } from "@/components/features/CarouselNavigation";
import { CarouselPagination } from "@/components/features/CarouselPagination";
import { useCarouselAutoPlay } from "@/hooks/useCarouselAutoPlay";

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

const VizualniPrikazUstnic = () => {
  const { user, selectedChild, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { handleManualNavigation } = useCarouselAutoPlay({ api, current, count });

  const handlePrevClick = () => {
    if (api) { api.scrollPrev(); handleManualNavigation(); }
  };
  const handleNextClick = () => {
    if (api) { api.scrollNext(); handleManualNavigation(); }
  };
  const handleDotClick = (index: number) => {
    if (api) { api.scrollTo(index); handleManualNavigation(); }
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user) return null;

  return (
    <div className={cn(
      "bg-dragon-green",
      isMobile ? "fixed inset-0 overflow-hidden flex flex-col" : "min-h-screen"
    )}>
      <Header />

      {/* Top SVG wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 z-0" style={{ height: '80px' }}>
        <svg className="relative block w-full" style={{ height: '80px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#4CAF50" />
        </svg>
      </div>

      {/* Bottom SVG wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0" style={{ height: '80px' }}>
        <svg className="relative block w-full" style={{ height: '80px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#4CAF50" />
        </svg>
      </div>

      <div className={cn(
        "relative z-10 max-w-4xl mx-auto px-4 w-full",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Title */}
        <div className={cn("text-center", isMobile ? "mb-3" : "mb-6 md:mb-16")}>
          <h1 className={cn(
            "font-bold text-white",
            isMobile ? "text-2xl mb-1" : "text-3xl md:text-4xl mb-2 md:mb-4"
          )}>
            Vizualni prikaz ustnic
          </h1>
          {!isMobile && (
            <p className="text-white/80 text-lg">
              Poglej kako so ustnice postavljene pri izgovorjavi posameznega glasu
            </p>
          )}
        </div>

        {selectedChild ? (
          <div className={cn("w-full mx-auto", isMobile ? "flex-1 flex flex-col overflow-hidden" : "")}>
            <div className="relative">
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{ align: "center", loop: true, containScroll: "trimSnaps" }}
              >
                <CarouselContent className="-ml-3 md:-ml-6">
                  {soundCards.map((card) => (
                    <CarouselItem key={card.id} className={cn(
                      "pl-3 md:pl-6",
                      isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"
                    )}>
                      <div className="h-full p-1">
                        <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 h-full flex flex-col items-center justify-between min-h-0 md:min-h-[280px] border-0">
                          {/* Image */}
                          <div className="flex items-center justify-center mb-3 md:mb-5 flex-1">
                            <img
                              src={card.image}
                              alt={card.title}
                              className={cn(
                                "w-full object-contain rounded-lg",
                                isMobile ? "max-h-[35vh]" : "max-h-[250px]"
                              )}
                              loading="lazy"
                            />
                          </div>

                          {/* Title */}
                          <h3 className={cn(
                            "font-bold text-foreground text-center",
                            isMobile ? "text-lg mb-2" : "text-xl md:text-2xl mb-3 md:mb-4"
                          )}>
                            {card.title}
                          </h3>

                          {/* Audio button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            disabled={!card.audioUrl}
                            onClick={(e) => { e.stopPropagation(); }}
                          >
                            <Volume2 className="w-4 h-4" />
                            {card.audioUrl ? "Zvočna navodila" : "Zvočna navodila – kmalu"}
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselNavigation
                  onPrevClick={handlePrevClick}
                  onNextClick={handleNextClick}
                  isMobile={isMobile}
                />
              </Carousel>
            </div>

            <CarouselPagination
              count={count}
              current={current}
              onDotClick={handleDotClick}
            />
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
