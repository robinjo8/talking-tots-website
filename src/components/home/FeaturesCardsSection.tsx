import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";

const features = [
  {
    title: "Video navodila",
    description: "Poglej kako logoped pravilno izgovori posamezne črke.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Zmajcek_video_7.png",
    buttonText: "Začni zdaj",
    buttonAction: "start",
  },
  {
    title: "Preverjanje izgovorjave",
    description: "Preverjanje izgovorjave za vse slovenske soglasnike.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_artikulacija_4.png",
    buttonText: "Kako deluje?",
    buttonAction: "howItWorks",
  },
  {
    title: "Govorne igre",
    description: "Zabavne igre za izboljšanje izgovorjave.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre_4.png",
    buttonText: "Začni zdaj",
    buttonAction: "start",
  },
];

function FeatureCard({ feature, onButtonClick }: { feature: typeof features[0]; onButtonClick: (action: string) => void }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold text-app-blue mb-3">
          {feature.title}
        </h3>
        <p className="text-muted-foreground mb-6">
          {feature.description}
        </p>
        <Button
          onClick={() => onButtonClick(feature.buttonAction)}
          className="bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold px-6 py-2 rounded-full"
        >
          {feature.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

function MobileFeatureCarousel({ 
  features, 
  onButtonClick 
}: { 
  features: { title: string; description: string; image: string; buttonText: string; buttonAction: string }[];
  onButtonClick: (action: string) => void;
}) {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    // Start at the middle card (Preverjanje izgovorjave)
    api.scrollTo(1, false);
    
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
    <div className="w-full">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "center",
          loop: false,
          startIndex: 1,
        }}
      >
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="basis-full flex justify-center">
              <div className="w-full max-w-sm p-1">
                <FeatureCard feature={feature} onButtonClick={onButtonClick} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Pagination dots */}
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
            onClick={() => api?.scrollTo(i)}
            aria-label={`Pojdi na kartico ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturesCardsSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSubscribed, isLoading } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleButtonClick = (action: string) => {
    if (action === "start") {
      if (!user) {
        navigate("/login");
      } else if (isLoading) {
        // Still checking subscription, do nothing
        return;
      } else if (!isSubscribed) {
        setShowSubscriptionModal(true);
      } else {
        navigate("/moje-aplikacije");
      }
    } else if (action === "howItWorks") {
      navigate("/delovanje-testa");
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Kaj ponuja TomiTalk?
        </h2>
        
        {/* Mobile Carousel */}
        <div className="md:hidden">
          <MobileFeatureCarousel features={features} onButtonClick={handleButtonClick} />
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} onButtonClick={handleButtonClick} />
          ))}
        </div>
      </div>
      
      <SubscriptionRequiredModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal}
      />
    </section>
  );
}
