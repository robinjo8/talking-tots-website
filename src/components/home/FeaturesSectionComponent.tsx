
import { FeaturesCarousel } from "@/components/FeaturesCarousel";

export const FeaturesSectionComponent = () => {
  return (
    <section id="features" className="py-12 px-4 md:py-20 md:px-6 lg:px-8 bg-light-cloud w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-2">Kako TomiTalk deluje?</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto px-4">
            Naša aplikacija omogoča razvoj govora na zabaven in učinkovit način s pomočjo interaktivnih funkcij
          </p>
        </div>
        
        <FeaturesCarousel />
      </div>
    </section>
  );
};
