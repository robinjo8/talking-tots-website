import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check } from "lucide-react";
import { WavyDivider } from "./WavyDivider";

export const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/moje-aplikacije");
    }
  };

  const scrollToFeatures = () => {
    const learningSection = document.getElementById('learning-outcomes');
    if (learningSection) {
      learningSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trustBadges = [
    { text: "Temelji na logopedskih smernicah" },
    { text: "Dokazan napredek pri izgovorjavi" },
    { text: "Priporočeno s strani staršev" }
  ];

  return (
    <section className="relative bg-white w-full overflow-hidden pt-20 pb-32 md:pb-40">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-12 items-center'}`}>
          {/* Left: Text Content */}
          <div className={`${isMobile ? 'text-center' : 'text-left'} space-y-6`}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">Odpravite govorne težave brez čakanja </span>
              <span className="text-dragon-green">- na zabaven način</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              Razvito s strani logopedov, da pomaga vašemu otroku pri razvoju govora
            </p>

            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
              <Button
                onClick={handleStartNow}
                size="lg"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold px-8 py-6 text-lg"
              >
                Začni zdaj
              </Button>
              
              <Button
                onClick={scrollToFeatures}
                size="lg"
                variant="outline"
                className="border-2 border-dragon-green text-dragon-green hover:bg-dragon-green/10 font-semibold px-8 py-6 text-lg"
              >
                Več o tem
              </Button>
            </div>

            {/* Trust Badges */}
            <div className={`pt-6 space-y-3 ${isMobile ? 'flex flex-col items-center' : ''}`}>
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-dragon-green/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-dragon-green" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dragon Image */}
          <div className={`relative ${isMobile ? 'order-first' : ''}`}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_naslovna_slika.png"
                alt="Zmajček maskota"
                className="w-full h-full object-contain animate-float"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
          </div>
        </div>
      </div>
      <WavyDivider color="green" position="bottom" />
    </section>
  );
};
