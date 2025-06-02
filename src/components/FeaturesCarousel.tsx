import { useState, useEffect, useCallback } from "react";
import { Mic, Stars, Volume2, MessageSquare, Zap, Book, Award, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
      icon: <Book className="h-8 w-8 text-dragon-green" />,
      title: "Odobreno s strani logopedov",
      description: "Razvito v sodelovanju s profesionalnimi logopedi",
      gradient: "from-dragon-green/20 to-app-teal/20",
      color: "text-dragon-green"
    },
    {
      icon: <Mic className="h-8 w-8 text-app-blue" />, 
      title: "Prepoznavanje glasu",
      description: "Posluša govor vašega otroka in nudi koristne povratne informacije",
      gradient: "from-app-blue/20 to-app-purple/20",
      color: "text-app-blue"
    },
    {
      icon: <Stars className="h-8 w-8 text-app-purple" />,
      title: "Zabavne aktivnosti",
      description: "Privlačne igre, ki naredijo učenje govora prijetno",
      gradient: "from-app-purple/20 to-app-blue/20",
      color: "text-app-purple"
    },
    {
      icon: <Volume2 className="h-8 w-8 text-app-teal" />,
      title: "Vodnik za izgovorjavo",
      description: "Jasni avdio primeri pravilne izgovorjave besed",
      gradient: "from-app-teal/20 to-dragon-green/20",
      color: "text-app-teal"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-app-orange" />,
      title: "Interaktivni pogovor",
      description: "Pogovarjajte se z našim prijaznim zmajčkom za vajo v pogovorih",
      gradient: "from-app-orange/20 to-app-yellow/20",
      color: "text-app-orange"
    },
    {
      icon: <Zap className="h-8 w-8 text-app-yellow" />,
      title: "Sledenje napredku",
      description: "Spremljajte izboljšanje vašega otroka skozi čas",
      gradient: "from-app-yellow/20 to-app-orange/20",
      color: "text-app-yellow"
    },
    {
      icon: <Award className="h-8 w-8 text-app-blue" />,
      title: "Sistem nagrajevanja",
      description: "Pridobivajte značke in odklepajte nove zmajčke",
      gradient: "from-app-blue/20 to-app-teal/20",
      color: "text-app-blue"
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
    <div className="w-full max-w-7xl mx-auto">
      {/* Centered carousel container with proper spacing */}
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
        <Carousel 
          setApi={setApi} 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            containScroll: "trimSnaps"
          }}
        >
          <CarouselContent className="ml-0">
            {features.map((feature, index) => (
              <CarouselItem key={index} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 min-w-0">
                <div className="h-full">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 h-full flex flex-col border border-gray-100/50">
                    {/* Icon Section */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-md",
                        feature.gradient
                      )}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="text-center flex-grow">
                      <h3 className={cn("text-lg font-bold mb-3 leading-tight", feature.color)}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Buttons - Positioned outside the carousel content */}
          <button 
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 h-12 w-12 bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center z-10 transition-all duration-200"
            aria-label="Prejšnja funkcija"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button 
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 h-12 w-12 bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center z-10 transition-all duration-200"
            aria-label="Naslednja funkcija"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </Carousel>
      </div>

      {/* Pagination dots - Centered below carousel */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-200",
              i === current ? "bg-dragon-green scale-110" : "bg-gray-300 hover:bg-gray-400"
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
