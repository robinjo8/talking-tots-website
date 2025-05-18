
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SelectChildDialog } from "@/components/SelectChildDialog";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartNow = () => {
    // First check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Then check if a child profile is selected
    if (selectedChildIndex !== null && profile?.children) {
      navigate("/moja-stran");
    } else if (profile?.children?.length === 0) {
      navigate("/profile");
    } else {
      setShowChildSelector(true);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <SidebarProvider>
        <Header />
        
        <HeroSection 
          isVisible={isVisible}
          onStartNow={handleStartNow}
          onScrollToFeatures={scrollToFeatures}
        />
        
        <FeaturesSection />
        
        <CallToActionSection />
        
        <FooterSection />
        
        <SelectChildDialog
          open={showChildSelector}
          onOpenChange={setShowChildSelector}
        />
      </SidebarProvider>
    </div>
  );
};

export default Index;
