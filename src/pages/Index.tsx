
import Header from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import ProgressComparisonSection from "@/components/ProgressComparisonSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import PricingSection from "@/components/PricingSection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Progress Comparison Section */}
      <ProgressComparisonSection />

      {/* Features Section */}
      <FeaturesSection />
      
      {/* Call to Action with Dragon */}
      <CallToActionSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
