
import { useState, useEffect, useCallback } from "react";
import { Mic, Stars, Volume2, MessageSquare, Zap, Book, Award, ChevronLeft, ChevronRight } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const FeaturesCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  
  const features = [
    {
      icon: <Book className="h-10 w-10 text-dragon-green" />,
      title: "Odobreno s strani logopedov",
      description: "Razvito v sodelovanju s profesionalnimi logopedi",
    },
    {
      icon: <Mic className="h-10 w-10 text-app-blue" />, 
      title: "Prepoznavanje glasu",
      description: "Posluša govor vašega otroka in nudi koristne povratne informacije",
    },
    {
      icon: <Stars className="h-10 w-10 text-app-purple" />,
      title: "Zabavne aktivnosti",
      description: "Privlačne igre, ki naredijo učenje govora prijetno",
    },
    {
      icon: <Volume2 className="h-10 w-10 text-app-teal" />,
      title: "Vodnik za izgovorjavo",
      description: "Jasni avdio primeri pravilne izgovorjave besed",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-app-orange" />,
      title: "Interaktivni pogovor",
      description: "Pogovarjajte se z našim prijaznim zmajčkom za vajo v pogovorih",
    },
    {
      icon: <Zap className="h-10 w-10 text-app-yellow" />,
      title: "Sledenje napredku",
      description: "Spremljajte izboljšanje vašega otroka skozi čas",
    },
    {
      icon: <Award className="h-10 w-10 text-app-blue" />,
      title: "Sistem nagrajevanja",
      description: "Pridobivajte značke in odklepajte nove zmajčke",
    },
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
    <div className="relative w-full overflow-hidden">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps"
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 min-w-0">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <button 
          onClick={handlePrevClick}
          className="absolute left-0 md:-left-4 h-10 w-10 md:h-12 md:w-12 bg-white shadow-lg hover:bg-light-cloud border-2 border-gray-100 rounded-full flex items-center justify-center top-1/2 -translate-y-1/2 z-10"
          aria-label="Prejšnja funkcija"
        >
          <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-dragon-green" />
        </button>
        <button 
          onClick={handleNextClick}
          className="absolute right-0 md:-right-4 h-10 w-10 md:h-12 md:w-12 bg-white shadow-lg hover:bg-light-cloud border-2 border-gray-100 rounded-full flex items-center justify-center top-1/2 -translate-y-1/2 z-10"
          aria-label="Naslednja funkcija"
        >
          <ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-dragon-green" />
        </button>
      </Carousel>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === current ? "bg-dragon-green" : "bg-gray-300"
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
