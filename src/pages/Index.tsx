
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Book, Stars, MessageSquare, Zap, Volume2, Award, CheckCircle, Shield, Users, CirclePlay, Info, PiggyBank, ArrowUp, Check, Target, BarChart2, Gamepad2, Trophy, Video, LineChart, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SelectChildDialog } from "@/components/SelectChildDialog";
import { FeaturesCarousel } from "@/components/FeaturesCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

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

  // Testimonials data with the new addition
  const testimonials = [
    {
      quote: "Moj sin je imel težave z izgovorjavo črke R. Po enem mesecu vaj z zmajčkom Tomijem jo izgovarja brez težav! Toplo priporočam!",
      author: "— Tanja, mama 6-letnika"
    }, {
      quote: "Končno nekaj, kar je narejeno za slovenske otroke! Govorne vaje so zabavne in hčerka komaj čaka, da jih dela vsak dan.",
      author: "— Mateja, mama 5-letnice"
    }, {
      quote: "Čakalna doba za logopeda je bila več kot pol leta. TomiTalk nama je pomagal takoj. Napredek je očiten že po 10 dneh.",
      author: "— Andrej, oče 4-letnika"
    }, {
      quote: "Najbolj všeč mi je, da lahko dodam oba otroka in vsak ima svoj profil. Vaje so res prilagojene posamezniku.",
      author: "— Nina, mama 3- in 7-letnika"
    }, {
      quote: "Z aplikacijo smo govorjenje spremenili v igro. Sin se smeje, vadi in napreduje – brez joka in pregovarjanja.",
      author: "— Maja, mama 5-letnika"
    }, {
      quote: "Z govornimi vajami se je mojemu otroku odprlo tudi na drugih področjih in ni več tako zaprt.",
      author: "— Peter, oče 6-letnika"
    }
  ];

  // Updated pricing packages to match subscription data
  const pricingPackages = [
    {
      name: "Mesečna naročnina",
      price: "19,90",
      period: "mesec",
      description: "Brez dolgoročne obveznosti",
      features: [
        "Govorne vaje (po črkah)",
        "Govorno jezikovne vaje", 
        "Govorne igre",
        "Izzivi za dodatno izboljšanje govora",
        "Video navodila logopeda",
        "Snemanje in primerjava z AI",
        "Sledenje napredku",
        "2 otroka vključena (v osnovi)",
        "Motivacija z zmajčkom Tomijem"
      ],
      recommended: false,
      buttonText: "Izberi mesečno naročnino"
    },
    {
      name: "Letna naročnina",
      price: "9,90",
      period: "mesec",
      description: "Priporočeno - Prihrani več kot 50%",
      originalPrice: "19,90",
      features: [
        "Govorne vaje (po črkah)",
        "Govorno jezikovne vaje",
        "Govorne igre", 
        "Izzivi za dodatno izboljšanje govora",
        "Video navodila logopeda",
        "Snemanje in primerjava z AI",
        "Sledenje napredku",
        "2 otroka vključena (v osnovi)",
        "Motivacija z zmajčkom Tomijem",
        "Enkratno letno plačilo"
      ],
      recommended: true,
      buttonText: "Izberi letno naročnino"
    }
  ];
  
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

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      
      {/* Hero Section - Fixed mobile layout with proper spacing */}
      <section id="purpose" className="pt-16 md:pt-32 pb-12 md:pb-24 px-4 relative w-full">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout - Fixed spacing and centering */}
          {isMobile && <div className={`flex flex-col items-center text-center space-y-4 min-h-[70vh] justify-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 ease-out`}>
              {/* Main Headlines - Properly centered with reduced spacing */}
              <div className="mb-4 px-2 w-full">
                <h1 className="text-xl sm:text-2xl leading-tight font-bold mb-4">
                  <span className="block text-neutral-950 mb-2">Odpravite govorne težave brez čakanja –</span>
                  <span className="block text-dragon-green">
                    s pomočjo pametnega AI pomočnika!
                  </span>
                </h1>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-950 font-medium max-w-2xl mx-auto">
                  Pridruži se staršem, ki že vsak dan vadijo govorne vaje s svojimi otroki – personalizirano glede na starost, težavo in logopedske smernice.
                </p>
              </div>
              
              {/* Action Buttons - Reduced spacing */}
              <div className="flex flex-col items-center gap-3 mb-6 w-full max-w-sm px-2">
                <Button size="lg" onClick={handleStartNow} className="w-full h-11 bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full flex items-center justify-center gap-2 text-sm font-semibold">
                  <Play className="h-4 w-4" />
                  Začni zdaj
                </Button>
                
                <div className="flex gap-2 w-full">
                  <Button size="lg" className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-xs font-semibold">
                    <CirclePlay className="h-4 w-4" />
                    Demo
                  </Button>
                  <Button size="lg" onClick={scrollToPricing} className="flex-1 h-11 bg-app-blue hover:bg-app-blue/90 text-white rounded-full flex items-center justify-center gap-2 text-xs font-semibold">
                    <PiggyBank className="h-4 w-4" />
                    Cenik
                  </Button>
                </div>
              </div>
              
              {/* Trust Badges - Reduced spacing */}
              <div className="flex justify-center gap-4 py-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-1 rounded-full bg-gradient-to-br from-dragon-green to-app-teal flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs max-w-[60px] leading-tight">Temelji na logopedskih smernicah</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-1 rounded-full bg-gradient-to-br from-app-blue to-app-purple flex items-center justify-center shadow-lg border-2 border-white">
                    <ArrowUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs max-w-[60px] leading-tight">Dokazan napredek pri izgovorjavi</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-1 rounded-full bg-gradient-to-br from-app-orange to-app-yellow flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-neutral-950 font-medium text-xs max-w-[60px] leading-tight">Priporočeno s strani staršev</span>
                </div>
              </div>
            </div>}
          
          {/* Desktop Layout - keep existing */}
          {!isMobile && <>
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
            </>}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-10 bg-light-cloud w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Kaj o TomiTalk pravijo starši?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pridružite se številnim družinam, ki so že odkrile moč TomiTalk aplikacije
            </p>
          </div>
          
          {/* Desktop Grid Layout */}
          {!isMobile && <div className="grid grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => <div key={index} className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between min-h-[280px] relative overflow-hidden border-0">
                  {/* Quote Icon */}
                  <div className="absolute top-4 left-4 text-dragon-green/20">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                  
                  {/* Quote Content */}
                  <div className="flex-grow flex flex-col justify-center pt-6">
                    <blockquote className="text-foreground italic text-base md:text-lg leading-relaxed mb-6 text-center">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  {/* Author */}
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                      {testimonial.author}
                    </p>
                  </div>
                </div>)}
            </div>}
          
          {/* Mobile Carousel Layout */}
          {isMobile && <TestimonialsCarousel />}
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

      {/* Pricing Section - Fixed mobile layout to show packages side by side */}
      <section id="pricing" className="py-16 md:py-20 px-4 md:px-10 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Naročniški paketi</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparentno cenovanje brez skritih stroškov. Izberite paket, ki vam najbolj ustreza.
            </p>
          </div>
          
          {/* Mobile and Desktop: 2 cards side by side - Fixed for proper side-by-side layout */}
          <div className="grid grid-cols-2 gap-2 md:gap-8 max-w-5xl mx-auto">
            {pricingPackages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-lg md:rounded-2xl shadow-lg border-2 p-3 md:p-8 ${
                  pkg.recommended 
                    ? 'border-dragon-green md:scale-105' 
                    : 'border-gray-200'
                } transition-all duration-300 hover:shadow-xl`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-2 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-dragon-green text-white px-2 md:px-4 py-1 text-xs md:text-sm font-semibold">
                      Priporočeno
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-3 md:mb-8">
                  <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{pkg.name}</h3>
                  <p className="text-xs md:text-base text-gray-600 mb-2 md:mb-4 leading-tight">{pkg.description}</p>
                  
                  <div className="mb-2 md:mb-4">
                    {pkg.originalPrice && (
                      <span className="text-xs md:text-lg text-gray-400 line-through mr-1 md:mr-2">
                        €{pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-lg md:text-4xl font-bold text-gray-900">
                      €{pkg.price}
                    </span>
                    <span className="text-xs md:text-base text-gray-600">/{pkg.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-1 md:space-y-4 mb-3 md:mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-1 md:gap-3">
                      <Check className="h-3 w-3 md:h-5 md:w-5 text-dragon-green mt-0.5 flex-shrink-0" />
                      <span className="text-xs md:text-base text-gray-700 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full h-9 md:h-12 rounded-lg font-semibold text-xs md:text-base ${
                    pkg.recommended
                      ? 'bg-dragon-green hover:bg-dragon-green/90 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={handleStartNow}
                >
                  {isMobile ? (pkg.recommended ? 'Izberi letno' : 'Izberi mesečno') : pkg.buttonText}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 md:mt-12">
            <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
              Vsak dodatni otrok: +3,90 € / mesec
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              Naročnino lahko kadarkoli prekličete brez dodatnih stroškov
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action with Dragon - Improved mobile layout */}
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
      
      {/* Footer */}
      <footer className="py-8 md:py-10 px-4 md:px-10 bg-light-cloud w-full">
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
