
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Book, Stars, MessageSquare, Zap, Volume2, Award, CheckCircle, Shield, Users, CirclePlay, Info, PiggyBank, ArrowUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SelectChildDialog } from "@/components/SelectChildDialog";
import { FeaturesCarousel } from "@/components/FeaturesCarousel";

const Index = () => {
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
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      
      {/* Hero Section - Optimized */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-12 pt-20 pb-10">
        {/* Background Elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto w-full">
          {/* Mobile Layout */}
          {isMobile && (
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Top Badge */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out`}>
                <Badge variant="secondary" className="bg-light-cloud text-dragon-green font-semibold px-4 py-2 text-sm">
                  Vodilni AI govorni pomočnik za otroke
                </Badge>
              </div>
              
              {/* Main Headline */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <h1 className="text-3xl md:text-4xl leading-tight font-bold">
                  <span className="block text-neutral-950">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green mt-2">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              
              {/* Subheadline */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-200`}>
                <p className="text-lg leading-relaxed text-neutral-950 font-medium max-w-md">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroci – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* CTA Buttons - Mobile */}
              <div className={`flex flex-col items-center gap-3 w-full max-w-xs ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300`}>
                <Button 
                  size="lg" 
                  onClick={handleStartNow} 
                  className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2 text-base font-semibold"
                >
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>
                <div className="flex gap-2 w-full">
                  <Button 
                    size="lg" 
                    className="flex-1 h-12 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2"
                  >
                    <CirclePlay className="h-4 w-4" />
                    Demo
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={scrollToFeatures} 
                    className="flex-1 h-12 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2"
                  >
                    <Info className="h-4 w-4" />
                    Info
                  </Button>
                </div>
              </div>
              
              {/* Trust Badges - Mobile */}
              <div className={`grid grid-cols-3 gap-4 mt-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <Award className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-xs leading-tight">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <ArrowUp className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-xs leading-tight">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <Users className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-xs leading-tight">Priporočeno s strani staršev</span>
                </div>
              </div>

              {/* Dragon Image - Mobile (moved below badges) */}
              <div className={`${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 ease-out delay-500 mt-8`}>
                <div className="relative w-48 h-48">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img 
                      alt="Tomi Talk Dragon Mascot" 
                      className="w-full h-full object-contain" 
                      src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Layout */}
          {!isMobile && (
            <div className="flex flex-col items-center text-center space-y-clamp(2rem,4vw,4rem) min-h-[calc(100vh-200px)] justify-center">
              {/* Dragon Image - Desktop (at the top) */}
              <div className={`${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 ease-out`}>
                <div className="relative w-clamp(16rem,20vw,24rem) h-clamp(16rem,20vw,24rem)">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img 
                      alt="Tomi Talk Dragon Mascot" 
                      className="w-full h-full object-contain" 
                      src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" 
                    />
                  </div>
                </div>
              </div>

              {/* Top Badge - Desktop (centered) */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <Badge variant="secondary" className="bg-light-cloud text-dragon-green font-semibold px-clamp(1.5rem,3vw,2rem) py-clamp(0.75rem,1.5vw,1rem) text-clamp(1rem,2vw,1.25rem)">
                  Vodilni AI govorni pomočnik za otroke
                </Badge>
              </div>
              
              {/* Main Headline - Desktop (centered) */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-200 max-w-5xl`}>
                <h1 className="text-clamp(2.5rem,5vw,4rem) leading-tight font-bold">
                  <span className="block text-neutral-950">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green mt-clamp(0.5rem,1vw,1rem)">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              
              {/* Subheadline - Desktop (centered) */}
              <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300 max-w-3xl`}>
                <p className="text-clamp(1.125rem,2.5vw,1.5rem) leading-relaxed text-neutral-950 font-medium">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroci – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* CTA Buttons - Desktop */}
              <div className={`flex flex-wrap justify-center gap-clamp(1rem,2vw,1.5rem) ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                <Button 
                  size="lg" 
                  onClick={handleStartNow} 
                  className="h-clamp(3rem,4vw,3.5rem) px-clamp(2rem,4vw,2.5rem) bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-3 text-clamp(1rem,2vw,1.125rem) font-semibold min-w-[200px]"
                >
                  <Play className="h-clamp(1.25rem,2vw,1.5rem) w-clamp(1.25rem,2vw,1.5rem)" />
                  Začni zdaj
                </Button>
                <Button 
                  size="lg" 
                  className="h-clamp(3rem,4vw,3.5rem) px-clamp(2rem,4vw,2.5rem) bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-3 text-clamp(1rem,2vw,1.125rem) font-semibold min-w-[180px]"
                >
                  <CirclePlay className="h-clamp(1.25rem,2vw,1.5rem) w-clamp(1.25rem,2vw,1.5rem)" />
                  Poglej demo
                </Button>
                <Button 
                  size="lg" 
                  onClick={scrollToFeatures} 
                  variant="outline"
                  className="h-clamp(3rem,4vw,3.5rem) px-clamp(2rem,4vw,2.5rem) border-2 border-dragon-green text-dragon-green hover:bg-dragon-green hover:text-white rounded-full flex items-center justify-center gap-3 text-clamp(1rem,2vw,1.125rem) font-semibold min-w-[160px]"
                >
                  <Info className="h-clamp(1.25rem,2vw,1.5rem) w-clamp(1.25rem,2vw,1.5rem)" />
                  Več info
                </Button>
              </div>
              
              {/* Trust Badges - Desktop */}
              <div className={`grid grid-cols-3 gap-clamp(2rem,4vw,3rem) mt-clamp(2rem,4vw,3rem) ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-500`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-clamp(4rem,8vw,5rem) h-clamp(4rem,8vw,5rem) mb-clamp(0.75rem,1.5vw,1rem) rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <Award className="h-clamp(2rem,4vw,2.5rem) w-clamp(2rem,4vw,2.5rem) text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-clamp(0.875rem,1.5vw,1rem) max-w-[12rem] leading-tight">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-clamp(4rem,8vw,5rem) h-clamp(4rem,8vw,5rem) mb-clamp(0.75rem,1.5vw,1rem) rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <ArrowUp className="h-clamp(2rem,4vw,2.5rem) w-clamp(2rem,4vw,2.5rem) text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-clamp(0.875rem,1.5vw,1rem) max-w-[12rem] leading-tight">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-clamp(4rem,8vw,5rem) h-clamp(4rem,8vw,5rem) mb-clamp(0.75rem,1.5vw,1rem) rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg border-4 border-white relative">
                    <Users className="h-clamp(2rem,4vw,2.5rem) w-clamp(2rem,4vw,2.5rem) text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <span className="text-neutral-950 font-semibold text-clamp(0.875rem,1.5vw,1rem) max-w-[12rem] leading-tight">Priporočeno s strani staršev</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-10 bg-light-cloud w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kako TomiTalk deluje?</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Naša aplikacija omogoča razvoj govora na zabaven in učinkovit način s pomočjo interaktivnih funkcij
            </p>
          </div>
          
          <FeaturesCarousel />
        </div>
      </section>
      
      {/* Call to Action */}
      <section id="cta" className="py-20 px-4 md:px-10 relative overflow-hidden w-full">
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-app-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-orange/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-12 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ste pripravljeni na govorno avanturo?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full">
              Prenos za iOS
            </Button>
            <Button size="lg" className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full">
              Prenos za Android
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 md:px-10 bg-light-cloud w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-xl font-extrabold text-app-orange">Talk</span>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#" className="hover:text-dragon-green transition-colors">Politika zasebnosti</a>
            <a href="#" className="hover:text-dragon-green transition-colors">Pogoji uporabe</a>
            <a href="#" className="hover:text-dragon-green transition-colors">Kontaktirajte nas</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            © 2025 Tomi Talk. Vse pravice pridržane.
          </div>
        </div>
      </footer>
      
      <SelectChildDialog open={showChildSelector} onOpenChange={setShowChildSelector} />
    </div>
  );
};

export default Index;
