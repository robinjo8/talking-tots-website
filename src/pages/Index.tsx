
import Header from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { TestimonialsSectionComponent } from "@/components/home/TestimonialsSectionComponent";
import { FeaturesSectionComponent } from "@/components/home/FeaturesSectionComponent";
import { CTASectionComponent } from "@/components/home/CTASectionComponent";
import { FooterSectionComponent } from "@/components/home/FooterSectionComponent";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <TestimonialsSectionComponent />
      <FeaturesSectionComponent />
      <CTASectionComponent />
      <FooterSectionComponent />
    </div>
  );
};

export default Index;
