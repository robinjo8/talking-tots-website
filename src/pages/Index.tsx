
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
        className={`w-full overflow-x-hidden ${isMobile ? 'py-12 px-4' : 'py-16 px-6 md:py-20 md:px-10'} bg-gradient-to-b from-background to-light-cloud/30`}
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12 md:mb-16'}`}>
            <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl mb-3' : 'text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6'}`}>
              Kako TomiTalk deluje?
            </h2>
            <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed`}>
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
