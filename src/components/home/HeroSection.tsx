import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, TrendingUp, Users } from "lucide-react";

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
    { 
      icon: Check, 
      text: "Temelji na logopedskih smernicah",
      bgColor: "bg-green-500"
    },
    { 
      icon: TrendingUp, 
      text: "Dokazan napredek pri izgovorjavi",
      bgColor: "bg-blue-500"
    },
    { 
      icon: Users, 
      text: "Priporočeno s strani staršev",
      bgColor: "bg-yellow-500"
    }
  ];

  return (
    <section className="relative bg-white w-full overflow-hidden pt-20 pb-8">
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
          </div>

          {/* Right: Dragon Image */}
          <div className={`relative ${isMobile ? 'order-first' : ''}`}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_naslovna_1.png"
                alt="Zmajček maskota"
                className="w-full h-full object-contain animate-float"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
          </div>
        </div>

        {/* Trust Badges - Now at the bottom in white section */}
        <div className="mt-16 mb-8">
          <div className={`flex ${isMobile ? 'flex-col items-center gap-8' : 'flex-row justify-center gap-12'}`}>
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center max-w-[200px]">
                  <div className={`w-20 h-20 rounded-full ${badge.bgColor} flex items-center justify-center mb-3 shadow-lg`}>
                    <IconComponent className="h-10 w-10 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-tight">
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
