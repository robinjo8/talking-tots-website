import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const [isCheckingLogopedist, setIsCheckingLogopedist] = useState(true);

  // Redirect logopedists to admin portal - check both metadata AND database
  useEffect(() => {
    const checkLogopedist = async () => {
      if (isLoading) {
        return; // Wait for auth to load
      }
      
      if (!user) {
        // No user, no need to check
        setIsCheckingLogopedist(false);
        return;
      }
      
      // First check metadata (synchronous, fast)
      if (user.user_metadata?.is_logopedist === true) {
        console.log("Index: Logopedist detected from metadata, redirecting to /admin");
        window.location.href = '/admin';
        return;
      }
      
      // Then check database as fallback
      try {
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
          console.log("Index: Logopedist detected from database, redirecting to /admin");
          window.location.href = '/admin';
          return;
        }
      } catch (error) {
        console.error("Index: Error checking logopedist profile:", error);
      }
      
      // Not a logopedist, allow rendering
      setIsCheckingLogopedist(false);
    };
    
    checkLogopedist();
  }, [user, isLoading]);

  // Show loading while checking if user is logopedist
  if (isLoading || isCheckingLogopedist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Nalaganje...</p>
        </div>
      </div>
    );
  }

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
