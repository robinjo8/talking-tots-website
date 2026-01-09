import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { LearningOutcomesSection } from "@/components/home/LearningOutcomesSection";
import { TargetAudienceSection } from "@/components/home/TargetAudienceSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import NewProgressComparisonSection from "@/components/home/ProgressComparisonSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  const { user, isLoading } = useAuth();

  // Redirect logopedists to admin portal - check both metadata AND database
  useEffect(() => {
    const checkLogopedist = async () => {
      if (!isLoading && user) {
        // First check metadata
        if (user.user_metadata?.is_logopedist === true) {
          window.location.href = '/admin';
          return;
        }
        
        // Then check database as fallback
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
          window.location.href = '/admin';
        }
      }
    };
    
    checkLogopedist();
  }, [user, isLoading]);

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

      {/* Pricing Section */}
      <PricingSection />

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
