import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import { FooterSection } from "@/components/home/FooterSection";

const Cenik = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        <PricingSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default Cenik;
