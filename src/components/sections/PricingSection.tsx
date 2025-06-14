
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const PricingSection = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Updated pricing packages to match subscription data
  const pricingPackages = [
    {
      name: "Mesečna naročnina",
      price: "19,90",
      period: "mesec",
      description: "Brez dolgoročne obveznosti",
      features: [
        "Govorne vaje (po črkah)",
        "Govorno jezikovne vaje", 
        "Govorne igre",
        "Izzivi za dodatno izboljšanje govora",
        "Video navodila logopeda",
        "Snemanje in primerjava z AI",
        "Sledenje napredku",
        "2 otroka vključena (v osnovi)",
        "Motivacija z zmajčkom Tomijem"
      ],
      recommended: false,
      buttonText: "Izberi mesečno naročnino"
    },
    {
      name: "Letna naročnina",
      price: "9,90",
      period: "mesec",
      description: "Priporočeno - Prihrani več kot 50%",
      originalPrice: "19,90",
      features: [
        "Govorne vaje (po črkah)",
        "Govorno jezikovne vaje",
        "Govorne igre", 
        "Izzivi za dodatno izboljšanje govora",
        "Video navodila logopeda",
        "Snemanje in primerjava z AI",
        "Sledenje napredku",
        "2 otroka vključena (v osnovi)",
        "Motivacija z zmajčkom Tomijem",
        "Enkratno letno plačilo"
      ],
      recommended: true,
      buttonText: "Izberi letno naročnino"
    }
  ];

  const handleStartNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Continue with existing behavior for logged in users
    navigate("/moja-stran");
  };

  return (
    <section id="pricing" className="py-16 md:py-20 px-4 md:px-10 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Naročniški paketi</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparentno cenovanje brez skritih stroškov. Izberite paket, ki vam najbolj ustreza.
          </p>
        </div>
        
        {/* Mobile and Desktop: 2 cards side by side - Fixed for proper side-by-side layout */}
        <div className="grid grid-cols-2 gap-2 md:gap-8 max-w-5xl mx-auto">
          {pricingPackages.map((pkg, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-lg md:rounded-2xl shadow-lg border-2 p-3 md:p-8 ${
                pkg.recommended 
                  ? 'border-dragon-green md:scale-105' 
                  : 'border-gray-200'
              } transition-all duration-300 hover:shadow-xl`}
            >
              {pkg.recommended && (
                <div className="absolute -top-2 md:-top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-dragon-green text-white px-2 md:px-4 py-1 text-xs md:text-sm font-semibold">
                    Priporočeno
                  </Badge>
                </div>
              )}
              
              <div className="text-center mb-3 md:mb-8">
                <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{pkg.name}</h3>
                <p className="text-xs md:text-base text-gray-600 mb-2 md:mb-4 leading-tight">{pkg.description}</p>
                
                <div className="mb-2 md:mb-4">
                  {pkg.originalPrice && (
                    <span className="text-xs md:text-lg text-gray-400 line-through mr-1 md:mr-2">
                      €{pkg.originalPrice}
                    </span>
                  )}
                  <span className="text-lg md:text-4xl font-bold text-gray-900">
                    €{pkg.price}
                  </span>
                  <span className="text-xs md:text-base text-gray-600">/{pkg.period}</span>
                </div>
              </div>
              
              <ul className="space-y-1 md:space-y-4 mb-3 md:mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-1 md:gap-3">
                    <Check className="h-3 w-3 md:h-5 md:w-5 text-dragon-green mt-0.5 flex-shrink-0" />
                    <span className="text-xs md:text-base text-gray-700 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full h-9 md:h-12 rounded-lg font-semibold text-xs md:text-base ${
                  pkg.recommended
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                onClick={handleStartNow}
              >
                {isMobile ? (pkg.recommended ? 'Izberi letno' : 'Izberi mesečno') : pkg.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6 md:mt-12">
          <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
            Vsak dodatni otrok: +3,90 € / mesec
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            Naročnino lahko kadarkoli prekličete brez dodatnih stroškov
          </p>
        </div>
      </div>
    </section>
  );
};
