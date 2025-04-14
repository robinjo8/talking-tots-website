
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Mic, Play, Book, Stars, MessageSquare, Zap, Volume2, Award } from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return <div className="min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-10 relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-app-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-60 h-60 bg-app-blue/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className={`${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} transition-all duration-700 ease-out`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Naredimo govor <span className="rainbow-text">zabaven</span> – za male junake!
            </h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-xl">
              Tomi Talk otrokom pomaga pri učenju govora skozi igro z našim prijaznim zmajčkom Tomijem. Govorjenje še nikoli ni bilo tako zabavno!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full">
                Začni brezplačno
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                <Play className="mr-2 h-4 w-4" /> Oglej si demo
              </Button>
            </div>
          </div>
          
          <div className={`relative ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} transition-all duration-700 ease-out delay-300`}>
            <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
            <div className="animate-float relative">
              <img alt="Tomi Talk Dragon Mascot" className="w-full max-w-md mx-auto" src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-10 bg-light-cloud">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kako Tomi Talk pomaga</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Naša aplikacija omogoča razvoj govora na zabaven in učinkovit način s pomočjo interaktivnih funkcij
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Mic className="h-10 w-10 text-app-blue" />} title="Prepoznavanje glasu" description="Posluša govor vašega otroka in nudi koristne povratne informacije" delay={1} />
            <FeatureCard icon={<Stars className="h-10 w-10 text-app-purple" />} title="Zabavne aktivnosti" description="Privlačne igre, ki naredijo učenje govora prijetno" delay={2} />
            <FeatureCard icon={<Volume2 className="h-10 w-10 text-app-teal" />} title="Vodnik za izgovorjavo" description="Jasni avdio primeri pravilne izgovorjave besed" delay={3} />
            <FeatureCard icon={<MessageSquare className="h-10 w-10 text-app-orange" />} title="Interaktivni pogovor" description="Pogovarjajte se z našim prijaznim zmajčkom za vajo v pogovorih" delay={4} />
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Zap className="h-10 w-10 text-app-yellow" />} title="Sledenje napredku" description="Spremljajte izboljšanje vašega otroka skozi čas" className="lg:col-span-1" delay={5} />
            <FeatureCard icon={<Book className="h-10 w-10 text-dragon-green" />} title="Odobreno s strani logopedov" description="Razvito v sodelovanju s profesionalnimi logopedi" className="lg:col-span-1" delay={6} />
            <FeatureCard icon={<Award className="h-10 w-10 text-app-blue" />} title="Sistem nagrajevanja" description="Pridobivajte značke in odklepajte nove zmajčke" className="lg:col-span-1" delay={7} />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section id="cta" className="py-20 px-6 md:px-10 relative overflow-hidden">
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
      <footer className="py-10 px-6 md:px-10 bg-light-cloud">
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
    </div>;
};
export default Index;
