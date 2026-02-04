import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check } from "lucide-react";
import { useBannerVisible } from "@/components/MissingChildBanner";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";
import { useState } from "react";

export const HeroSection = () => {
  const bannerVisible = useBannerVisible();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isSubscribed, isLoading } = useSubscriptionContext();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // If still loading, navigate anyway - SubscriptionGate on target page will handle access
    if (isLoading) {
      navigate("/moje-aplikacije");
      return;
    }
    
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
    } else {
      navigate("/moje-aplikacije");
    }
  };

  const scrollToFeatures = () => {
    const learningSection = document.getElementById('learning-outcomes');
    if (learningSection) {
      const headerHeight = isMobile ? 64 : 80; // Different header height for mobile
      const elementPosition = learningSection.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const trustBadges = [
    { text: "Temelji na logopedskih smernicah" },
    { text: "Napredek pri izgovorjavi" },
    { text: "Priporočeno s strani staršev" }
  ];

  return (
    <section className={`relative bg-white w-full overflow-hidden pb-16 md:pb-40 ${bannerVisible ? 'pt-32 md:pt-48' : 'pt-24 md:pt-36'}`}>
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
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.webp"
                    alt="Zmajček maskota"
                    className="w-full h-full object-contain animate-float"
                    style={{ transform: 'scaleX(-1)' }}
                    fetchPriority="high"
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
                {user ? "Začni zdaj" : "Začni brezplačno"}
              </Button>
              
              <Button
                onClick={() => user ? scrollToFeatures() : navigate('/cenik')}
                size="lg"
                variant="outline"
                className="border-2 border-dragon-green text-dragon-green hover:bg-dragon-green/10 font-semibold px-8 py-5 md:py-6 text-lg"
              >
                {user ? "Izvedite več" : "Kupi TomiTalk"}
              </Button>

              {user && !isSubscribed && !isLoading && (
                <Button
                  onClick={() => navigate("/brezplacne-igre")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-app-orange text-app-orange hover:bg-app-orange/10 font-semibold px-8 py-5 md:py-6 text-lg"
                >
                  Brezplačne igre
                </Button>
              )}
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
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.webp"
                  alt="Zmajček maskota"
                  className="w-full h-full object-contain animate-float"
                  style={{ transform: 'scaleX(-1)' }}
                  fetchPriority="high"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SubscriptionRequiredModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal}
      />
    </section>
  );
};
