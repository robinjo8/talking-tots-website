
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Mic, Play, Book, Stars, MessageSquare, Zap, Volume2, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SelectChildDialog } from "@/components/SelectChildDialog";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const { user, profile, selectedChildIndex } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartNow = () => {
    // First check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Then check if a child profile is selected
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
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Header />
      
      {/* Hero Section - Improved layout and balance */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 md:px-10 relative w-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className={`${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} transition-all duration-700 ease-out`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Naredimo govor <span className="text-gradient-rainbow">zabaven</span> – za male junake!
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl">
              Tomi Talk otrokom pomaga pri učenju govora skozi igro z našim prijaznim zmajčkom Tomijem. Govorjenje še nikoli ni bilo tako zabavno!
            </p>
            
            {/* Action Buttons - Better aligned and responsive */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full px-8"
                onClick={handleStartNow}
              >
                Začni zdaj
              </Button>
              <Button 
                size="lg" 
                className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full px-8"
              >
                <Play className="mr-2 h-4 w-4" /> Poglej demo
              </Button>
              <Button 
                size="lg" 
                className="bg-app-orange hover:bg-app-orange/90 text-white rounded-full px-8"
                onClick={scrollToFeatures}
              >
                Raziskuj
              </Button>
            </div>
          </div>
          
          <div className={`relative ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} transition-all duration-700 ease-out delay-300`}>
            <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
            <div className="animate-float relative">
              <img 
                alt="Tomi Talk Dragon Mascot" 
                className="w-4/5 md:w-full max-w-md mx-auto drop-shadow-xl" 
                src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Improved spacing and card alignment */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-light-cloud">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kako Tomi Talk pomaga</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Naša aplikacija omogoča razvoj govora na zabaven in učinkovit način s pomočjo interaktivnih funkcij
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Mic className="h-10 w-10 text-app-blue" />} 
              title="Prepoznavanje glasu" 
              description="Posluša govor vašega otroka in nudi koristne povratne informacije" 
              delay={1} 
            />
            <FeatureCard 
              icon={<Stars className="h-10 w-10 text-app-purple" />} 
              title="Zabavne aktivnosti" 
              description="Privlačne igre, ki naredijo učenje govora prijetno" 
              delay={2} 
            />
            <FeatureCard 
              icon={<Volume2 className="h-10 w-10 text-app-teal" />} 
              title="Vodnik za izgovorjavo" 
              description="Jasni avdio primeri pravilne izgovorjave besed" 
              delay={3} 
            />
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10 text-app-orange" />} 
              title="Interaktivni pogovor" 
              description="Pogovarjajte se z našim prijaznim zmajčkom za vajo v pogovorih" 
              delay={4} 
            />
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-app-yellow" />} 
              title="Sledenje napredku" 
              description="Spremljajte izboljšanje vašega otroka skozi čas" 
              delay={5} 
            />
            <FeatureCard 
              icon={<Book className="h-10 w-10 text-dragon-green" />} 
              title="Odobreno s strani logopedov" 
              description="Razvito v sodelovanju s profesionalnimi logopedi" 
              delay={6} 
            />
            <FeatureCard 
              icon={<Award className="h-10 w-10 text-app-blue" />} 
              title="Sistem nagrajevanja" 
              description="Pridobivajte značke in odklepajte nove zmajčke" 
              delay={7} 
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action Section - Better visual balance */}
      <section id="cta" className="py-16 md:py-24 px-4 sm:px-6 md:px-10 relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-app-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-app-orange/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-12 text-center relative z-10 border border-gray-100">
          <div className="absolute -top-10 right-10 hidden md:block">
            <img 
              src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" 
              alt="Tomi Dragon" 
              className="h-24 w-24 object-contain animate-bounce-gentle"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ste pripravljeni na govorno avanturo?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full px-8">
              Prenos za iOS
            </Button>
            <Button size="lg" className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full px-8">
              Prenos za Android
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer Section - Better alignment and spacing */}
      <footer className="py-8 md:py-12 px-4 sm:px-6 md:px-10 bg-light-cloud border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-8 w-8" 
            />
            <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-xl font-extrabold text-app-orange">Talk</span>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center mb-6 md:mb-0">
            <a href="#" className="hover:text-dragon-green transition-colors">Politika zasebnosti</a>
            <a href="#" className="hover:text-dragon-green transition-colors">Pogoji uporabe</a>
            <a href="#" className="hover:text-dragon-green transition-colors">Kontaktirajte nas</a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2025 Tomi Talk. Vse pravice pridržane.
          </div>
        </div>
      </footer>
      
      <SelectChildDialog
        open={showChildSelector}
        onOpenChange={setShowChildSelector}
      />
    </div>
  );
};

export default Index;
