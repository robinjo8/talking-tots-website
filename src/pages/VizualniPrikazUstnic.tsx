import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";


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
  const isMobile = useIsMobile();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [desktopCarouselApi, setDesktopCarouselApi] = useState<CarouselApi>();
  const [desktopCurrentSlide, setDesktopCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  const onDesktopSelect = useCallback(() => {
    if (!desktopCarouselApi) return;
    setDesktopCurrentSlide(desktopCarouselApi.selectedScrollSnap());
  }, [desktopCarouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    onSelect();
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi, onSelect]);

  useEffect(() => {
    if (!desktopCarouselApi) return;
    onDesktopSelect();
    desktopCarouselApi.on("select", onDesktopSelect);
    return () => { desktopCarouselApi.off("select", onDesktopSelect); };
  }, [desktopCarouselApi, onDesktopSelect]);

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
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      <Header />

      <section className="flex-1 pt-20 md:pt-24 pb-4 flex items-center justify-center">
        <div className="container max-w-6xl mx-auto px-4">

          {selectedChild ? (
            isMobile ? (
              <div className="w-full mt-8">
                <Carousel
                  setApi={setCarouselApi}
                  className="w-full"
                  opts={{
                    align: "center",
                    loop: false,
                  }}
                >
                  <CarouselContent>
                    {soundCards.map((card) => {
                      const isFlipped = flippedCardId === card.id;
                      return (
                        <CarouselItem key={card.id} className="basis-full flex justify-center">
                          <div className="w-full max-w-sm p-1">
                            <div
                              className="flip-card cursor-pointer rounded-xl"
                              style={{ minHeight: '420px' }}
                              onClick={() => handleCardClick(card.id)}
                            >
                              <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '420px' }}>
                                <div className="flip-card-front flex-col p-0 overflow-hidden">
                                  <div className={`w-full flex-1 bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center gap-1`}>
                                    <span className={`text-sm font-bold ${card.textColor} opacity-80 uppercase tracking-widest`}>Glas</span>
                                    <span className={`text-5xl md:text-6xl font-black ${card.textColor} drop-shadow-sm`}>{card.sounds.join(", ")}</span>
                                  </div>
                                  <div className="w-full bg-white py-3 px-2 flex items-center justify-center border-t border-gray-100">
                                    <span className={`text-base font-bold ${card.textColor} text-center leading-tight`}>Odpri</span>
                                  </div>
                                </div>
                                <div className="flip-card-back flex-col p-4 justify-between">
                                  <h3 className={`text-lg font-bold ${card.color} text-center`}>{card.title}</h3>
                                  <img src={card.image} alt={card.title} className="w-full max-h-[250px] object-contain rounded-lg" loading="lazy" />
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
                </Carousel>
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
                          ? "w-3 h-3 bg-dragon-green shadow-sm"
                          : "w-2.5 h-2.5 bg-muted-foreground/40"
                      )} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg mx-auto mt-8">
                <Carousel
                  setApi={setDesktopCarouselApi}
                  className="w-full"
                  opts={{
                    align: "center",
                    loop: false,
                  }}
                >
                  <CarouselContent>
                    {soundCards.map((card) => {
                      const isFlipped = flippedCardId === card.id;
                      return (
                        <CarouselItem key={card.id} className="basis-full flex justify-center">
                          <div className="w-full p-1">
                            <div
                              className="flip-card cursor-pointer rounded-xl shadow-lg border-0 bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                              style={{ minHeight: '420px' }}
                              onClick={() => handleCardClick(card.id)}
                            >
                              <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '420px' }}>
                                <div className="flip-card-front flex-col p-0 overflow-hidden rounded-xl">
                                  <div className={`w-full flex-1 bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center gap-1`}>
                                    <span className={`text-sm font-bold ${card.textColor} opacity-80 uppercase tracking-widest`}>Glas</span>
                                    <span className={`text-5xl md:text-6xl font-black ${card.textColor} drop-shadow-sm`}>{card.sounds.join(", ")}</span>
                                  </div>
                                  <div className="w-full bg-white py-3 px-2 flex items-center justify-center border-t border-border">
                                    <span className={`text-base font-bold ${card.textColor} text-center leading-tight`}>Odpri</span>
                                  </div>
                                </div>
                                <div className="flip-card-back flex-col p-4 justify-between rounded-xl">
                                  <h3 className={`text-lg font-bold ${card.color} text-center`}>{card.title}</h3>
                                  <img src={card.image} alt={card.title} className="w-full max-h-[250px] object-contain rounded-lg" loading="lazy" />
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
                </Carousel>
                <div className="flex justify-center gap-2 mt-6">
                  {soundCards.map((_, i) => (
                    <button
                      key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-transparent transition-all duration-300"
                      onClick={() => desktopCarouselApi?.scrollTo(i)}
                      aria-label={`Pojdi na kartico ${i + 1}`}
                    >
                      <span className={cn(
                        "rounded-full transition-all duration-300",
                        i === desktopCurrentSlide
                          ? "w-3 h-3 bg-dragon-green shadow-sm"
                          : "w-2.5 h-2.5 bg-muted-foreground/40"
                      )} />
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-destructive">
                Prosimo, dodajte profil otroka v nastavitvah.
              </p>
            </div>
          )}
        </div>
      </section>

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
