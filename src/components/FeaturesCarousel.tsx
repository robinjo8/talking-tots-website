
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeatureItem } from "@/components/features/FeatureItem";
import { CarouselNavigation } from "@/components/features/CarouselNavigation";
import { CarouselPagination } from "@/components/features/CarouselPagination";
import { features } from "@/components/features/featuresData";
import { useCarouselAutoPlay } from "@/hooks/useCarouselAutoPlay";

export const FeaturesCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const isMobile = useIsMobile();

  const { handleManualNavigation } = useCarouselAutoPlay({ api, current, count });

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

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
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
    <div className="w-full max-w-7xl mx-auto px-0">
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
          <CarouselContent className="-ml-3 md:-ml-6">
            {features.map((feature, index) => (
              <CarouselItem key={index} className="pl-3 md:pl-6 md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-1">
                  <FeatureItem {...feature} />
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
  );
};
