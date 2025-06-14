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
    navigate("/moja-stran");
  };

  return (
    <section id="pricing" className={`w-full bg-white ${isMobile ? 'py-4 px-2' : 'py-16 md:py-20 px-4 md:px-10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8 md:mb-16'}`}>
          <h2 className={`font-bold ${isMobile ? 'text-base mb-1' : 'text-2xl md:text-3xl lg:text-4xl mb-4'}`}>
            Naročniški paketi
          </h2>
          <p className={`${isMobile ? 'text-xs' : 'text-base md:text-xl'} text-muted-foreground max-w-2xl mx-auto`}>
            Transparentno cenovanje brez skritih stroškov. Izberite paket, ki vam najbolj ustreza.
          </p>
        </div>
        <div className={`${isMobile ? 'flex flex-col gap-4 w-full' : 'grid grid-cols-2 gap-2 md:gap-8 max-w-5xl mx-auto'}`}>
          {pricingPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg md:rounded-2xl shadow-lg border-2 px-3 py-2 ${isMobile ? "w-full" : "md:p-8"} ${pkg.recommended ? 'border-dragon-green md:scale-105' : 'border-gray-200'} transition-all duration-300 hover:shadow-xl`}
            >
              {pkg.recommended && (
                <div className={`absolute -top-2 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'md:-top-4 left-1/2 transform -translate-x-1/2'}`}>
                  <Badge className="bg-dragon-green text-white px-2 md:px-4 py-1 text-xs md:text-sm font-semibold">
                    Priporočeno
                  </Badge>
                </div>
              )}
              <div className="text-center mb-2 md:mb-8">
                <h3 className={`font-bold ${isMobile ? 'text-sm mb-1 leading-tight' : 'text-sm md:text-2xl mb-1 md:mb-2 leading-tight'}`}>{pkg.name}</h3>
                <p className={`${isMobile ? 'text-xs mb-1 leading-tight' : 'text-xs md:text-base mb-2 md:mb-4 leading-tight'} text-gray-600`}>{pkg.description}</p>
                <div className={`${isMobile ? 'mb-1' : 'mb-2 md:mb-4'}`}>
                  {pkg.originalPrice && (
                    <span className={`${isMobile ? "text-xs mr-1" : "text-xs md:text-lg mr-1 md:mr-2 "} text-gray-400 line-through`}>
                      €{pkg.originalPrice}
                    </span>
                  )}
                  <span className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-lg md:text-4xl'}`}>
                    €{pkg.price}
                  </span>
                  <span className={`${isMobile ? 'text-xs ml-1' : 'text-xs md:text-base ml-1'} text-gray-600`}>/{pkg.period}</span>
                </div>
              </div>
              <ul className={`${isMobile ? 'space-y-1 mb-2' : 'space-y-2 md:space-y-4 mb-3 md:mb-8'}`}>
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-start gap-1 ${isMobile ? "text-xs" : "md:gap-3 text-xs md:text-base"} text-gray-700 leading-tight`}>
                    <Check className={`flex-shrink-0 mt-0.5 ${isMobile ? "h-3 w-3" : "h-3 w-3 md:h-5 md:w-5"} text-dragon-green`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full h-9 rounded-lg font-semibold ${isMobile ? 'text-xs' : 'md:h-12 text-xs md:text-base'} ${
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
        <div className={`text-center ${isMobile ? 'mt-2' : 'mt-6 md:mt-12'}`}>
          <p className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} text-gray-600 mb-1 md:mb-4`}>
            Vsak dodatni otrok: +3,90 € / mesec
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-xs md:text-sm'} text-gray-500`}>
            Naročnino lahko kadarkoli prekličete brez dodatnih stroškov
          </p>
        </div>
      </div>
    </section>
  );
};
