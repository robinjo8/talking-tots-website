
import FeatureCard from "@/components/FeatureCard";
import { Mic, Stars, Volume2, MessageSquare, Zap, Book, Award } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 md:px-10 bg-light-cloud rounded-3xl my-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
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
  );
}
