
import { useState, useEffect, useCallback } from "react";
import { Mic, Stars, Volume2, MessageSquare, Zap, Book, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const FeaturesCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  const features = [
    {
      icon: <Book className="h-6 w-6 text-white" />,
      title: "Odobreno s strani logopedov",
      description: "Razvito v sodelovanju s profesionalnimi logopedi",
      color: "bg-gradient-to-br from-dragon-green to-dragon-green/80"
    },
    {
      icon: <Mic className="h-6 w-6 text-white" />,
      title: "Prepoznavanje glasu",
      description: "Posluša govor vašega otroka in nudi koristne povratne informacije",
      color: "bg-gradient-to-br from-app-blue to-app-blue/80"
    },
    {
      icon: <Stars className="h-6 w-6 text-white" />,
      title: "Zabavne aktivnosti",
      description: "Privlačne igre, ki naredijo učenje govora prijetno",
      color: "bg-gradient-to-br from-app-purple to-app-purple/80"
    },
    {
      icon: <Volume2 className="h-6 w-6 text-white" />,
      title: "Vodnik za izgovorjavo",
      description: "Jasni avdio primeri pravilne izgovorjave besed",
      color: "bg-gradient-to-br from-app-teal to-app-teal/80"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "Interaktivni pogovor",
      description: "Pogovarjajte se z našim prijaznim zmajčkom za vajo v pogovorih",
      color: "bg-gradient-to-br from-app-orange to-app-orange/80"
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Sledenje napredku",
      description: "Spremljajte izboljšanje vašega otroka skozi čas",
      color: "bg-gradient-to-br from-app-yellow to-app-yellow/80"
    },
    {
      icon: <Award className="h-6 w-6 text-white" />,
      title: "Sistem nagrajevanja",
      description: "Pridobivajte značke in odklepajte nove zmajčke",
      color: "bg-gradient-to-br from-app-blue to-app-teal"
    }
  ];

  // Function to handle automatic scrolling
  const autoScroll = useCallback(() => {
    if (!api || !autoPlay) return;

    // Handle direction changes
    if (direction === 'right') {
      // If we're at the last item, change direction
      if (current === count - 1) {
        setDirection('left');
        api.scrollPrev();
      } else {
        api.scrollNext();
      }
    } else {
      // If we're at the first item, change direction
      if (current === 0) {
        setDirection('right');
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    }
  }, [api, autoPlay, current, count, direction]);

  // Setup auto-scrolling with interval
  useEffect(() => {
    const interval = setInterval(autoScroll, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [autoScroll]);

  // Pause auto-scroll when user interacts with carousel
  const handleManualNavigation = () => {
    setAutoPlay(false);

    // Resume auto-scroll after a period of inactivity
    const timeout = setTimeout(() => {
      setAutoPlay(true);
    }, 10000); // Resume after 10 seconds of inactivity

    return () => clearTimeout(timeout);
  };

  // Handle manual navigation with left arrow
  const handlePrevClick = () => {
    if (api) {
      api.scrollPrev();
      handleManualNavigation();
    }
  };

  // Handle manual navigation with right arrow
  const handleNextClick = () => {
    if (api) {
      api.scrollNext();
      handleManualNavigation();
    }
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="relative">
        <Carousel 
          setApi={setApi} 
          className="w-full" 
          opts={{
            align: "center",
            loop: true,
            containScroll: "trimSnaps"
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {features.map((feature, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-1">
                  <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between min-h-[300px] relative overflow-hidden border-0">
                    {/* Icon Section */}
                    <div className="flex items-center justify-center mb-6">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-md", feature.color)}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="text-center flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-4 leading-tight text-foreground line-clamp-2 py-[5px]">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Buttons */}
          <button 
            onClick={handlePrevClick} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 bg-background shadow-lg hover:shadow-xl hover:bg-muted border border-border rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
            aria-label="Prejšnja funkcija"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button 
            onClick={handleNextClick} 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 bg-background shadow-lg hover:shadow-xl hover:bg-muted border border-border rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
            aria-label="Naslednja funkcija"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </Carousel>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              i === current 
                ? "bg-dragon-green scale-125 shadow-sm" 
                : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
            )}
            onClick={() => {
              api?.scrollTo(i);
              handleManualNavigation();
            }}
            aria-label={`Pojdi na predstavitev ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
