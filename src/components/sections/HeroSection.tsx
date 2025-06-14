
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, ArrowUp, Users, CirclePlay, PiggyBank } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SelectChildDialog } from "@/components/SelectChildDialog";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const {
    user,
    profile,
    selectedChildIndex
  } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedChildIndex !== null && profile?.children) {
      navigate("/moja-stran");
    } else if (profile?.children?.length === 0) {
      navigate("/profile");
    } else {
      setShowChildSelector(true);
    }
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
    <>
      <section
        className={
          isMobile
            ? "relative w-full flex flex-col items-center justify-start pt-20 pb-8 px-4 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-light-cloud/30"
            : "relative w-full flex items-center justify-center pt-24 pb-16 px-6 min-h-screen bg-gradient-to-b from-background via-background to-light-cloud/20"
        }
      >
        {/* Background decorations */}
        <div className="absolute -top-10 -left-10 w-32 h-32 md:w-60 md:h-60 bg-app-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-40 h-40 md:w-80 md:h-80 bg-app-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 md:w-40 md:h-40 bg-dragon-green/10 rounded-full blur-2xl"></div>
        
        <div className={`max-w-7xl mx-auto w-full ${isMobile ? "flex flex-col items-center text-center space-y-6" : "flex flex-col items-center text-center space-y-8"}`}>
          {/* Mobile Layout */}
          {isMobile && (
            <div
              className={`flex flex-col items-center text-center space-y-6 w-full ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } transition-all duration-700 ease-out`}
            >
              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl leading-[1.1] font-bold tracking-tight">
                  <span className="block text-gray-900 mb-2">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green bg-gradient-to-r from-dragon-green to-app-teal bg-clip-text text-transparent">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
                <p className="text-base leading-relaxed text-gray-600 font-medium max-w-lg mx-auto">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center space-y-3 w-full max-w-sm">
                <Button 
                  size="lg" 
                  onClick={handleStartNow} 
                  className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Začni zdaj
                </Button>
                <div className="flex gap-3 w-full">
                  <Button 
                    size="lg" 
                    className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CirclePlay className="h-4 w-4 mr-1" />
                    Demo
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={scrollToPricing} 
                    className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <PiggyBank className="h-4 w-4 mr-1" />
                    Cenik
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm pt-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs leading-tight">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-2 border-white">
                    <ArrowUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs leading-tight">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs leading-tight">Priporočeno s strani staršev</span>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <div className="relative flex flex-col items-center justify-center text-center space-y-12 min-h-[75vh]">
              {/* Main Headline */}
              <div className={`space-y-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-[1.1] font-bold tracking-tight">
                  <span className="block text-gray-900 mb-4">Odpravite govorne težave brez čakanja –</span>
                  <span className="block bg-gradient-to-r from-dragon-green via-app-teal to-dragon-green bg-clip-text text-transparent animate-pulse">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
                <p className="text-xl md:text-2xl lg:text-2xl leading-relaxed text-gray-600 font-medium max-w-4xl mx-auto">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className={`flex flex-wrap justify-center gap-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300`}>
                <Button 
                  size="lg" 
                  onClick={handleStartNow} 
                  className="px-8 py-4 h-14 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Začni zdaj
                </Button>
                <Button 
                  size="lg" 
                  className="px-8 py-4 h-14 bg-app-blue hover:bg-app-blue/90 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                >
                  <CirclePlay className="h-5 w-5 mr-2" />
                  Poglej demo
                </Button>
                <Button 
                  size="lg" 
                  onClick={scrollToPricing} 
                  className="px-8 py-4 h-14 bg-app-blue hover:bg-app-blue/90 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                >
                  <PiggyBank className="h-5 w-5 mr-2" />
                  Poglej cenik
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                <div className="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-xl border-4 border-white group-hover:shadow-2xl transition-shadow duration-300">
                    <CheckCircle className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold text-base lg:text-lg">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-xl border-4 border-white group-hover:shadow-2xl transition-shadow duration-300">
                    <ArrowUp className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold text-base lg:text-lg">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-xl border-4 border-white group-hover:shadow-2xl transition-shadow duration-300">
                    <Users className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold text-base lg:text-lg">Priporočeno s strani staršev</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <SelectChildDialog open={showChildSelector} onOpenChange={setShowChildSelector} />
    </>
  );
};
