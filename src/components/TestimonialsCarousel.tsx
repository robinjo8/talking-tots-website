
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const TestimonialsCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  const testimonials = [
    {
      quote: "Moj sin je imel težave z izgovorjavo črke R. Po enem mesecu vaj z zmajčkom Tomijem jo izgovarja brez težav! Toplo priporočam!",
      author: "— Tanja, mama 6-letnika"
    },
    {
      quote: "Končno nekaj, kar je narejeno za slovenske otroke! Govorne vaje so zabavne in hčerka komaj čaka, da jih dela vsak dan.",
      author: "— Mateja, mama 5-letnice"
    },
    {
      quote: "Čakalna doba za logopeda je bila več kot pol leta. TomiTalk nama je pomagal takoj. Napredek je očiten že po 10 dneh.",
      author: "— Andrej, oče 4-letnika"
    },
    {
      quote: "Najbolj všeč mi je, da lahko dodam oba otroka in vsak ima svoj profil. Vaje so res prilagojene posamezniku.",
      author: "— Nina, mama 3- in 7-letnika"
    },
    {
      quote: "Z aplikacijo smo govorjenje spremenili v igro. Sin se smeje, vadi in napreduje – brez joka in pregovarjanja.",
      author: "— Maja, mama 5-letnika"
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
    const interval = setInterval(autoScroll, 6000); // 6 seconds interval
    return () => clearInterval(interval);
  }, [autoScroll]);

  // Pause auto-scroll when user interacts with carousel
  const handleManualNavigation = () => {
    setAutoPlay(false);

    // Resume auto-scroll after a period of inactivity
    const timeout = setTimeout(() => {
      setAutoPlay(true);
    }, 12000); // Resume after 12 seconds of inactivity

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
      <div className="relative overflow-visible">
        <Carousel 
          setApi={setApi} 
          className="w-full overflow-visible" 
          opts={{
            align: "center",
            loop: true,
            containScroll: "trimSnaps"
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between border border-gray-100/50 min-h-[280px] relative">
                    {/* Quote Icon */}
                    <div className="absolute top-4 left-4 text-dragon-green/20">
                      <Quote className="h-8 w-8" />
                    </div>
                    
                    {/* Quote Content */}
                    <div className="flex-grow flex flex-col justify-center pt-6">
                      <blockquote className="text-gray-700 italic text-base md:text-lg leading-relaxed mb-6 text-center">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    
                    {/* Author */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm font-medium">
                        {testimonial.author}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Buttons */}
          <button 
            onClick={handlePrevClick} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 border border-gray-200/50 rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
            aria-label="Prejšnja ocena"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            onClick={handleNextClick} 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 border border-gray-200/50 rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
            aria-label="Naslednja ocena"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
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
                : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => {
              api?.scrollTo(i);
              handleManualNavigation();
            }}
            aria-label={`Pojdi na oceno ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
