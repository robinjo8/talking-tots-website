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
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/kako-deluje", label: "Kako deluje" },
  { to: "/kdo-smo", label: "Kdo smo" },
  { to: "/cenik", label: "Cenik" },
  { to: "/informacije", label: "Informacije" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/logopedski-koticek", label: "Logopedski kotički" },
  { to: "/za-posameznike", label: "Za posameznike" },
  { to: "/za-podjetja", label: "Za podjetja" },
  { to: "/clanki/razvoj-govora", label: "Razvoj govora" },
  { to: "/clanki/motorika-govoril", label: "Motorika govoril" },
  { to: "/clanki/govorno-jezikovne-tezave", label: "Govorno-jezikovne težave" },
  { to: "/clanki/pogosta-vprasanja", label: "Pogosta vprašanja" },
  { to: "/pomoc-in-podpora", label: "Pomoč in podpora" },
];

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

      {/* Quick Links - SEO internal linking */}
      <nav className="py-10 px-4 md:px-10 bg-muted/50" aria-label="Hitre povezave">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4">Raziščite TomiTalk</h2>
          <ul className="flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
