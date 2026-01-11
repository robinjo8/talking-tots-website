import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import { FooterSection } from "@/components/home/FooterSection";

const Cenik = () => {
  return (
    <div className="h-screen md:min-h-screen bg-background overflow-hidden md:overflow-auto">
      <Header />
      
      <main className="pt-16 md:pt-24 h-[calc(100vh-64px)] md:h-auto">
        <PricingSection />
      </main>

      <div className="hidden md:block">
        <FooterSection />
      </div>
    </div>
  );
};

export default Cenik;
