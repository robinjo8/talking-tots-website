import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const CallToActionSection = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/moja-stran");
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="cta" className="py-16 md:py-20 px-4 md:px-10 relative overflow-hidden w-full">
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-app-teal/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-orange/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Mobile Layout with Dragon - Fixed dragon visibility */}
        {isMobile && (
          <div className="bg-white shadow-xl rounded-2xl md:rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ste pripravljeni na govorno avanturo?</h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8">
              Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
            </p>
            
            {/* Dragon for mobile - Fixed sizing and full visibility */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
              <div className="animate-float relative">
                <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain drop-shadow-lg" src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full h-12" onClick={handleStartNow}>
                Začni zdaj
              </Button>
              <Button size="lg" onClick={scrollToPricing} className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full h-12">
                Poglej cenik
              </Button>
            </div>
          </div>
        )}
        
        {/* Desktop Layout with Dragon - keep existing */}
        {!isMobile && (
          <div className="bg-white shadow-xl rounded-3xl p-12 relative overflow-hidden">
            <div className="flex items-center justify-between gap-12">
              {/* Left side - Text content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ste pripravljeni na govorno avanturo?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Začnite z TomiTalk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full" onClick={handleStartNow}>
                    Začni zdaj
                  </Button>
                  <Button size="lg" onClick={scrollToPricing} className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full">
                    Poglej cenik
                  </Button>
                </div>
              </div>
              
              {/* Right side - Dragon - improved positioning and visibility */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain drop-shadow-lg" src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
