import Header from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { LearningOutcomesSection } from "@/components/home/LearningOutcomesSection";
import { TargetAudienceSection } from "@/components/home/TargetAudienceSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import NewProgressComparisonSection from "@/components/home/ProgressComparisonSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturesCardsSection } from "@/components/home/FeaturesCardsSection";
import { TeamSection } from "@/components/home/TeamSection";
import FAQSection from "@/components/home/FAQSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Learning Outcomes Section */}
      <div id="learning-outcomes">
        <LearningOutcomesSection />
      </div>

      {/* Target Audience Section */}
      <TargetAudienceSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Progress Comparison Section */}
      <NewProgressComparisonSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Features Cards Section (replacing Pricing) */}
      <FeaturesCardsSection />

      {/* Team Section */}
      <TeamSection />

      {/* FAQ Section */}
      <FAQSection />
      
      {/* Call to Action Section */}
      <CallToActionSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
