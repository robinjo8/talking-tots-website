import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    title: "Video navodila",
    description: "Poglej kako logoped pravilno izgovori posamezne črke.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Zmajcek_video_7.png",
    buttonText: "Začni zdaj",
    buttonAction: "start",
  },
  {
    title: "Preverjanje izgovorjave",
    description: "Test izgovorjave za vse slovenske soglasnike.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_artikulacija_4.png",
    buttonText: "Kako deluje?",
    buttonAction: "howItWorks",
  },
  {
    title: "Govorne igre",
    description: "Zabavne igre za izboljšanje izgovorjave.",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre_4.png",
    buttonText: "Začni zdaj",
    buttonAction: "start",
  },
];

export function FeaturesCardsSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleButtonClick = (action: string) => {
    if (action === "start") {
      if (user) {
        navigate("/moje-aplikacije");
      } else {
        navigate("/login");
      }
    } else if (action === "howItWorks") {
      navigate("/delovanje-testa");
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Kaj ponuja TomiTalk?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-app-blue mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <Button
                  onClick={() => handleButtonClick(feature.buttonAction)}
                  className="bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold px-6 py-2 rounded-full"
                >
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
