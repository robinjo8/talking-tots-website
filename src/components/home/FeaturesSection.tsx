
import { FeaturesCarousel } from "@/components/FeaturesCarousel";

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-14 px-4 md:px-[40px] bg-light-cloud w-full overflow-x-hidden">
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
  );
};
