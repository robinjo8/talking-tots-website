
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Play, ArrowRight } from "lucide-react";

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
    <section className={`relative overflow-hidden w-full ${isMobile ? 'py-12 px-4' : 'py-16 px-6 md:py-20 md:px-10'} bg-gradient-to-b from-light-cloud/20 to-background`}>
      {/* Background decorations */}
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-app-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-orange/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-dragon-green/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Mobile Layout */}
        {isMobile && (
          <div className="bg-white shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden border border-gray-100">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  Ste pripravljeni na govorno avanturo?
                </h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                  Prenesite TomiTalk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
                </p>
              </div>
              
              {/* Dragon for mobile */}
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-2xl opacity-20 scale-75 animate-pulse"></div>
                <div className="animate-float relative">
                  <img 
                    alt="Tomi Talk Dragon Mascot" 
                    className="w-full h-full object-contain drop-shadow-xl" 
                    src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  size="lg" 
                  className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-xl h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                  onClick={handleStartNow}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Začni zdaj
                </Button>
                <Button 
                  size="lg" 
                  onClick={scrollToPricing} 
                  className="bg-app-blue hover:bg-app-blue/90 text-white rounded-xl h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Poglej cenik
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="bg-white shadow-2xl rounded-3xl p-12 lg:p-16 relative overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between gap-16">
              {/* Left side - Text content */}
              <div className="flex-1 space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Ste pripravljeni na govorno avanturo?
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    Začnite z TomiTalk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <Button 
                    size="lg" 
                    className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-xl px-8 py-4 h-14 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform" 
                    onClick={handleStartNow}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Začni zdaj
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={scrollToPricing} 
                    className="bg-app-blue hover:bg-app-blue/90 text-white rounded-xl px-8 py-4 h-14 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Poglej cenik
                  </Button>
                </div>
              </div>
              
              {/* Right side - Dragon */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75 animate-pulse"></div>
                  <div className="animate-float relative">
                    <img 
                      alt="Tomi Talk Dragon Mascot" 
                      className="w-full h-full object-contain drop-shadow-2xl" 
                      src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" 
                    />
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
