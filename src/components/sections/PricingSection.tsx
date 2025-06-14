
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
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
      buttonText: "Izberi mesečno naročnino",
      popular: false
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
      buttonText: "Izberi letno naročnino",
      popular: true
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
    <section 
      id="pricing" 
      className={`w-full bg-gradient-to-b from-background to-light-cloud/20 ${isMobile ? 'py-12 px-4' : 'py-16 px-6 md:py-20 md:px-10'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12 md:mb-16'}`}>
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl mb-3' : 'text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6'}`}>
            Naročniški paketi
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed`}>
            Transparentno cenovanje brez skritih stroškov. Izberite paket, ki vam najbolj ustreza.
          </p>
        </div>

        <div className={`${isMobile ? 'flex flex-col gap-6 max-w-sm mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'}`}>
          {pricingPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl md:rounded-3xl shadow-xl border-2 ${isMobile ? "p-6" : "p-8 md:p-10"} ${
                pkg.recommended 
                  ? 'border-dragon-green md:scale-105 ring-4 ring-dragon-green/20' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-300 hover:shadow-2xl group`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className={`absolute -top-4 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'}`}>
                  <Badge className="bg-dragon-green text-white px-4 py-2 text-sm font-bold shadow-lg border-2 border-white">
                    <Star className="h-4 w-4 mr-1" />
                    Priporočeno
                  </Badge>
                </div>
              )}

              <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
                <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-lg mb-2' : 'text-xl md:text-2xl mb-3'}`}>
                  {pkg.name}
                </h3>
                <p className={`${isMobile ? 'text-sm mb-4' : 'text-base mb-6'} text-gray-600 leading-relaxed`}>
                  {pkg.description}
                </p>
                
                <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
                  {pkg.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className={`${isMobile ? "text-base" : "text-lg md:text-xl"} text-gray-400 line-through`}>
                        €{pkg.originalPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs font-bold">
                        -50%
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-baseline justify-center">
                    <span className={`font-bold text-gray-900 ${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'}`}>
                      €{pkg.price}
                    </span>
                    <span className={`${isMobile ? 'text-sm ml-2' : 'text-base md:text-lg ml-2'} text-gray-600`}>
                      /{pkg.period}
                    </span>
                  </div>
                </div>
              </div>

              <ul className={`${isMobile ? 'space-y-3 mb-6' : 'space-y-4 mb-8'}`}>
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-start gap-3 ${isMobile ? "text-sm" : "text-base"} text-gray-700`}>
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 bg-dragon-green rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'} rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  pkg.recommended
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white hover:scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105'
                }`}
                onClick={handleStartNow}
              >
                {isMobile ? (pkg.recommended ? 'Izberi letno' : 'Izberi mesečno') : pkg.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className={`text-center ${isMobile ? 'mt-8' : 'mt-12 md:mt-16'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto border border-gray-100">
            <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-gray-700 mb-3 font-semibold`}>
              Vsak dodatni otrok: +3,90 € / mesec
            </p>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
              Naročnino lahko kadarkoli prekličete brez dodatnih stroškov
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
