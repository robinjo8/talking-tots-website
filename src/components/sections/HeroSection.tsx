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
        id="purpose"
        className={`relative w-full flex items-center justify-center md:pt-20 md:pb-8 ${
          isMobile
            ? "pt-8 pb-4 px-2 min-h-[calc(100dvh-64px)] flex flex-col justify-center items-center"
            : "pt-16 pb-6 px-4 min-h-screen"
        }`}
        style={isMobile ? { minHeight: 'calc(100dvh - 64px)' } : undefined}
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        <div className={`max-w-6xl mx-auto w-full ${isMobile ? "flex flex-col flex-1 h-full justify-center" : ""}`}>
          {isMobile && (
            <div
              className={`flex flex-col items-center justify-center text-center gap-5 w-full min-h-0 flex-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } transition-all duration-700 ease-out`}
            >
              {/* Headline at very top & fully visible */}
              <div className="w-full flex flex-col items-center mt-0 mb-2 px-1">
                <h1 className="text-2xl leading-tight font-bold mb-2 mt-2">
                  <span className="block text-neutral-950">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              <p className="text-base leading-relaxed text-neutral-950 font-medium max-w-2xl mx-auto mb-1">
                Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
              </p>

              {/* Action Buttons - Compact spacing */}
              <div className="flex flex-col items-center gap-2 w-full max-w-sm px-2">
                <Button size="lg" onClick={handleStartNow} className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2 text-base font-semibold">
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>
                <div className="flex gap-2 w-full">
                  <Button size="lg" className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-sm font-semibold">
                    <CirclePlay className="h-4 w-4" />
                    Demo
                  </Button>
                  <Button size="lg" onClick={scrollToPricing} className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-sm font-semibold">
                    <PiggyBank className="h-4 w-4" />
                    Cenik
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 py-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-11 h-11 mb-2 rounded-full bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm max-w-[68px] leading-tight">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-11 h-11 mb-2 rounded-full bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-2 border-white">
                    <ArrowUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm max-w-[68px] leading-tight">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-11 h-11 mb-2 rounded-full bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-sm max-w-[68px] leading-tight">Priporočeno s strani staršev</span>
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="relative flex flex-col items-center justify-center text-center min-h-[70vh]">
              {/* Main Headline - Centered with better vertical spacing */}
              <div className={`mb-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight font-bold">
                  <span className="block text-neutral-950 mb-4">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              
              {/* Subheadline - Centered with proper spacing */}
              <div className={`mb-12 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-200`}>
                <p className="text-xl md:text-2xl leading-relaxed text-neutral-950 font-medium max-w-5xl mx-auto">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons - Centered with improved spacing */}
              <div className={`flex flex-row gap-6 justify-center mb-16 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300`}>
                <Button size="lg" onClick={handleStartNow} className="w-auto sm:w-48 h-14 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2 text-lg font-semibold">
                  <Play className="h-5 w-5" />
                  Začni zdaj
                </Button>
                <Button size="lg" className="w-auto sm:w-48 h-14 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-lg font-semibold">
                  <CirclePlay className="h-5 w-5" />
                  Poglej demo
                </Button>
                <Button size="lg" onClick={scrollToPricing} className="w-auto sm:w-48 h-14 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5" />
                  Poglej cenik
                </Button>
              </div>
              
              {/* Trust Badges - Centered with better spacing */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-4 border-white">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-base">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-4 border-white">
                    <ArrowUp className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-base">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-4 border-white">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-base">Priporočeno s strani staršev</span>
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
