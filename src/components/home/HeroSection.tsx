
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, CirclePlay, Info, CheckCircle, ArrowUp, Users } from "lucide-react";
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
    // If not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    // If logged in, continue with existing behavior
    if (selectedChildIndex !== null && profile?.children) {
      navigate("/moja-stran");
    } else if (profile?.children?.length === 0) {
      navigate("/profile");
    } else {
      setShowChildSelector(true);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = featuresSection.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section className="pt-24 md:pt-32 pb-10 px-4 md:px-[40px]">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout - Centered */}
          {isMobile && (
            <div
              className={`flex flex-col items-center text-center space-y-6 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } transition-all duration-700 ease-out w-full max-w-sm mx-auto px-4`}
            >
              {/* Main Headlines - Centered */}
              <div className="mb-4 w-full">
                <h1 className="text-3xl leading-tight font-bold mb-4 break-words">
                  <span className="block text-neutral-950">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green mt-2">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-neutral-950 font-medium">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-3 mb-6 w-full">
                <Button
                  size="lg"
                  onClick={handleStartNow}
                  className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2 text-base font-semibold"
                >
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>

                <div className="flex gap-3 w-full">
                  <Button
                    size="lg"
                    className="flex-1 h-12 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-base font-semibold"
                  >
                    <CirclePlay className="h-4 w-4" />
                    Demo
                  </Button>
                  <Button
                    size="lg"
                    onClick={scrollToFeatures}
                    className="flex-1 h-12 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-base font-semibold"
                  >
                    <Info className="h-4 w-4" />
                    Info
                  </Button>
                </div>
              </div>
              
              {/* Trust Badges - Centered and padded */}
              <div className="flex justify-center gap-4 mb-6 py-5 w-full max-w-sm mx-auto">
                <div className="flex-1 min-w-0 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs leading-tight">
                    Temelji na logopedskih smernicah
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-2 border-white">
                    <ArrowUp className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs leading-tight">
                    Dokazan napredek pri izgovorjavi
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs leading-tight">
                    Priporočeno s strani staršev
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Layout - Centered content */}
          {!isMobile && (
            <div className="relative flex flex-col items-center justify-center text-center">
              {/* Main Headline - Centered */}
              <div className={`mb-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight font-bold">
                  <span className="block text-neutral-950">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green mt-2">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              
              {/* Subheadline - Centered */}
              <div className={`mb-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-200`}>
                <p className="text-lg md:text-xl leading-relaxed text-neutral-950 font-medium max-w-4xl mx-auto">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons - Centered */}
              <div className={`flex flex-row gap-4 justify-center mb-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300`}>
                <Button size="lg" onClick={handleStartNow} className="w-auto sm:w-48 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>
                <Button size="lg" className="w-auto sm:w-48 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2">
                  <CirclePlay className="h-4 w-4" />
                  Poglej demo
                </Button>
                <Button size="lg" onClick={scrollToFeatures} className="w-auto sm:w-48 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2">
                  <Info className="h-4 w-4" />
                  Več info
                </Button>
              </div>
              
              {/* Trust Badges - Centered */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 lg:mb-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-4 border-white">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-4 border-white">
                    <ArrowUp className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-4 border-white">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm">Priporočeno s strani staršev</span>
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
