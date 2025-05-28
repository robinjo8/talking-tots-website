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

  return <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      
      {/* Hero Section - Redesigned */}
      <section className="pt-16 md:pt-28 pb-10 md:pb-16 px-4 relative w-full md:px-[40px] py-[84px]">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto">
          {/* Top Badge - Centered on desktop */}
          <div className={`text-center mb-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out`}>
            <div className="flex justify-center lg:justify-center">
              <Badge variant="secondary" className="bg-light-cloud text-dragon-green font-semibold px-4 py-2 text-sm">
                Vodilni AI govorni pomočnik za otroke
              </Badge>
            </div>
          </div>
          
          {/* Main Content Container */}
          <div className="relative flex flex-col lg:flex-row lg:items-start items-center justify-between gap-8 lg:gap-12">
            {/* Left Content Column */}
            <div className="flex-1 text-center lg:text-left max-w-3xl">
              {/* Main Headline - Responsive text size for desktop */}
              <div className={`mb-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-100`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight font-bold">
                  <span className="block text-neutral-950 text-center lg:text-center">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green mt-2 text-center lg:text-center">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
              </div>
              
              {/* Subheadline */}
              <div className={`mb-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-200`}>
                <p className="text-lg md:text-xl leading-relaxed text-neutral-950 font-medium text-center lg:text-center">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons - Updated mobile layout */}
              <div className={`${isMobile ? 'flex flex-col items-center gap-3 mb-6' : 'flex flex-row gap-4 justify-center mb-10'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-300`}>
                <Button size="lg" onClick={handleStartNow} className={`${isMobile ? 'w-60 h-12' : 'w-auto sm:w-48'} bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2`}>
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>
                <Button size="lg" className={`${isMobile ? 'w-60 h-12' : 'w-auto sm:w-48'} bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2`}>
                  <CirclePlay className="h-4 w-4" />
                  Poglej demo
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToFeatures} className={`${isMobile ? 'w-60 h-12' : 'w-auto sm:w-48'} border-app-blue text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2`}>
                  <Info className="h-4 w-4" />
                  Več info
                </Button>
              </div>
              
              {/* Trust Badges - Desktop version */}
              {!isMobile && <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 lg:mb-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-400`}>
                  <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-4 transition-colors cursor-default">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm whitespace-nowrap">Temelji na logopedskih smernicah</span>
                  </div>
                  <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-4 transition-colors cursor-default">
                    <ArrowUp className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm whitespace-nowrap">Dokazan napredek pri izgovorjavi</span>
                  </div>
                  <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-4 transition-colors cursor-default">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm whitespace-nowrap">Preizkušeno in priporočeno s strani staršev</span>
                  </div>
                </div>}
            </div>
            
            {/* Right Dragon Column - Desktop with restored larger size and top alignment */}
            {!isMobile && <div className={`flex-shrink-0 self-start ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} transition-all duration-700 ease-out delay-300`}>
                <div className="relative w-80 h-80 xl:w-96 xl:h-96">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain" src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" />
                  </div>
                </div>
              </div>}
          </div>
          
          {/* Mobile Trust Badges and Dragon - Horizontal layout */}
          {isMobile && <div className={`flex items-center justify-between gap-4 mt-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out delay-500`}>
              {/* Left: Trust Badges */}
              <div className="flex-1 space-y-3">
                <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-3 transition-colors cursor-default">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-xs text-center">Temelji na logopedskih smernicah</span>
                </div>
                <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-3 transition-colors cursor-default">
                  <ArrowUp className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-xs text-center">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="border border-app-blue bg-white text-app-blue hover:bg-app-blue hover:text-white rounded-full flex items-center justify-center gap-2 p-3 transition-colors cursor-default">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-xs text-center">Preizkušeno in priporočeno s strani staršev</span>
                </div>
              </div>
              
              {/* Right: Dragon */}
              <div className="flex-shrink-0 w-32 h-32">
                <div className="relative w-full h-full">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain" src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png" />
                  </div>
                </div>
              </div>
            </div>}
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
    </div>;
};

export default Index;
