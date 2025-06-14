
import Header from "@/components/Header";
import { FeaturesCarousel } from "@/components/FeaturesCarousel";
import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header />

      <HeroSection />

      <TestimonialsSection />

      {/* Features Section */}
      <section
        id="features"
        className={`w-full overflow-x-hidden ${isMobile ? 'py-6 px-2' : 'py-8 px-4 md:py-12 md:px-10 bg-light-cloud'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8 md:mb-12'}`}>
            <h2 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4'}`}>
              Kako TomiTalk deluje?
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} text-muted-foreground max-w-xl mx-auto`}>
              Naša aplikacija omogoča razvoj govora na zabaven in učinkovit način s pomočjo interaktivnih funkcij
            </p>
          </div>
          <FeaturesCarousel />
        </div>
      </section>

      <PricingSection />

      <CallToActionSection />

      <FooterSection />
    </div>
  );
};

export default Index;
