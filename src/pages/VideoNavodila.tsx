import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CarouselNavigation } from "@/components/features/CarouselNavigation";
import { CarouselPagination } from "@/components/features/CarouselPagination";
import { useCarouselAutoPlay } from "@/hooks/useCarouselAutoPlay";

const videoLetters = [
  { 
    letter: "S", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke S"
  },
  { 
    letter: "Z", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Z"
  },
  { 
    letter: "C", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke C"
  },
  { 
    letter: "Š", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Š"
  },
  { 
    letter: "Ž", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Ž"
  },
  { 
    letter: "Č", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Č"
  },
  { 
    letter: "K", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke K"
  },
  { 
    letter: "L", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke L"
  },
  { 
    letter: "R", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke R"
  },
];

const toAsciiUrl = (letter: string): string => {
  return letter.toLowerCase()
    .replace('č', 'ch')
    .replace('š', 'sh')
    .replace('ž', 'zh');
};

const VideoNavodila = () => {
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

  const handleLetterClick = (letter: string) => {
    navigate(`/video-navodila/${toAsciiUrl(letter)}`);
  };

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
        "relative z-10 max-w-7xl mx-auto px-4 w-full",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Title */}
        <div className={cn("text-center", isMobile ? "mb-3" : "mb-6 md:mb-16")}>
          <h1 className={cn(
            "font-bold text-white",
            isMobile ? "text-2xl mb-1" : "text-3xl md:text-4xl mb-2 md:mb-4"
          )}>
            Video navodila
          </h1>
        </div>

        {/* Carousel */}
        <div className={cn("w-full mx-auto", isMobile ? "flex-1 flex flex-col overflow-hidden" : "")}>
          <div className="relative">
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{ align: "center", loop: true, containScroll: "trimSnaps" }}
            >
              <CarouselContent className="-ml-3 md:-ml-6">
                {videoLetters.map((item) => (
                  <CarouselItem key={item.letter} className={cn(
                    "pl-3 md:pl-6",
                    isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"
                  )}>
                    <div className="h-full p-1">
                      <div
                        className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 h-full flex flex-col items-center justify-between min-h-0 md:min-h-[280px] border-0 cursor-pointer"
                        onClick={() => handleLetterClick(item.letter)}
                      >
                        {/* Dragon image */}
                        <div className="flex items-center justify-center mb-3 md:mb-5 flex-1">
                          <img
                            src={item.image}
                            alt={`Glas ${item.letter}`}
                            className={cn(
                              "w-full object-contain",
                              isMobile ? "max-h-[35vh]" : "max-h-[200px]"
                            )}
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h3 className={cn(
                          "font-bold text-foreground text-center",
                          isMobile ? "text-lg mb-1" : "text-xl md:text-2xl mb-3 md:mb-4"
                        )}>
                          Glas {item.letter}
                        </h3>

                        {/* Description */}
                        {!isMobile && (
                          <p className="text-muted-foreground leading-relaxed text-base text-center">
                            {item.description}
                          </p>
                        )}
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
      </div>
    </div>
  );
};

export default VideoNavodila;
