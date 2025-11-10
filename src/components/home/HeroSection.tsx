import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check } from "lucide-react";

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
    <section className="relative bg-white w-full overflow-hidden pt-24 md:pt-36 pb-16 md:pb-40">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-12 items-center'}`}>
          {/* Left: Text Content */}
          <div className={`${isMobile ? 'text-center' : 'text-left'} space-y-3 md:space-y-6`}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">{/*  leading-tight ensures consistent spacing between lines */}
              {isMobile ? (
                <>
                  <span className="text-foreground block">Odpravite govorne težave</span>
                  <span className="text-foreground block">brez čakanja</span>
                  <span className="text-dragon-green block">na zabaven način</span>
                </>
              ) : (
                <>
                  <span className="text-foreground">Odpravite govorne težave brez čakanja </span>
                  <span className="text-dragon-green">na zabaven način</span>
                </>
              )}
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground">
              Razvito s strani logopedov, da pomaga vašemu otroku pri razvoju govora
            </p>

            {/* Dragon Image - Mobile Only */}
            {isMobile && (
              <div className="relative -my-4">
                <div className="relative w-full aspect-square max-w-xs mx-auto scale-[0.8]">
                  <img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.png"
                    alt="Zmajček maskota"
                    className="w-full h-full object-contain animate-float"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                </div>
              </div>
            )}

            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
              <Button
                onClick={handleStartNow}
                size="lg"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold px-8 py-5 md:py-6 text-lg"
              >
                Začni zdaj
              </Button>
              
              <Button
                onClick={scrollToFeatures}
                size="lg"
                variant="outline"
                className="border-2 border-dragon-green text-dragon-green hover:bg-dragon-green/10 font-semibold px-8 py-5 md:py-6 text-lg"
              >
                Izvedite več
              </Button>
            </div>

            {/* Trust Badges - Hidden on mobile */}
            {!isMobile && (
              <div className="pt-6 space-y-3">
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
            )}
          </div>

          {/* Right: Dragon Image - Desktop Only */}
          {!isMobile && (
            <div className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <img
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.png"
                  alt="Zmajček maskota"
                  className="w-full h-full object-contain animate-float"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
