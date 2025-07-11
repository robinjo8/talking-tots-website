import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function SestavljankeGames() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const consonants = [
    { letter: "B", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "C", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Č", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "D", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "F", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "G", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "H", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "J", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "K", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "L", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "M", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "N", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "P", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "S", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Š", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
    { letter: "T", gradient: "from-app-purple/10 to-app-blue/10", color: "text-app-purple" },
    { letter: "V", gradient: "from-app-orange/10 to-app-yellow/10", color: "text-app-orange" },
    { letter: "Z", gradient: "from-dragon-green/10 to-app-teal/10", color: "text-dragon-green" },
    { letter: "Ž", gradient: "from-app-blue/10 to-app-purple/10", color: "text-app-blue" },
  ];

  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Section 1: Izberi sestavljanko */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 mt-12">Izberi sestavljanko:</h2>
          <div className="flex justify-start">
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer hover:scale-105 w-24 h-24"
              onClick={handleRClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">R</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Section 2: Kmalu na voljo */}
        <div>
          <h2 className="text-2xl font-bold mb-6 mt-12">Kmalu na voljo:</h2>
          
          {isMobile ? (
            <div className="w-full">
              <Carousel 
                setApi={setApi} 
                className="w-full" 
                opts={{
                  align: "start",
                  loop: false,
                  containScroll: "trimSnaps"
                }}
              >
                <CarouselContent className="-ml-2">
                  {consonants.map((consonant, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/3">
                      <div className="p-1">
                        <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24">
                          <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-3xl p-0 h-full flex items-center justify-center`}>
                            <CardTitle className="flex items-center justify-center">
                              <span className={`text-3xl font-bold ${consonant.color}`}>{consonant.letter}</span>
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Pagination dots for mobile */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-300",
                      i === current 
                        ? "bg-dragon-green scale-125 shadow-sm" 
                        : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                    )}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Pojdi na črko ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {consonants.map((consonant, index) => (
                <Card key={index} className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24">
                  <CardHeader className={`bg-gradient-to-r ${consonant.gradient} rounded-3xl p-0 h-full flex items-center justify-center`}>
                    <CardTitle className="flex items-center justify-center">
                      <span className={`text-3xl font-bold ${consonant.color}`}>{consonant.letter}</span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}