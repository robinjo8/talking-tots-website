
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Synchronized subscription data matching the profile section exactly
const pricingPackages = [
  {
    name: "Letna naročnina",
    price: "9,90 € / mesec",
    originalPrice: null,
    description: "Enkratno letno plačilo",
    savings: "Prihranite več kot 50 % v primerjavi z mesečno naročnino",
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
    cta: "Izberi letno naročnino",
    recommended: true,
    color: "dragon-green"
  },
  {
    name: "Mesečna naročnina", 
    price: "19,90 € / mesec",
    originalPrice: null,
    description: "Mesečno plačilo",
    savings: "Brez dolgoročne obveznosti",
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
    cta: "Izberi mesečno naročnino",
    recommended: false,
    color: "app-blue"
  }
];

export function PricingSection() {
  return (
    <section
      id="cenik"
      className="w-full bg-white py-10 md:py-16 px-4 border-t border-gray-100"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground">
          Enostavna, pregledna in prilagodljiva naročnina za vašo družino.
        </p>
      </div>
      
      {/* Mobile and Desktop: side-by-side cards */}
      <div className="flex flex-row gap-4 justify-center items-stretch max-w-4xl mx-auto
        [&>*]:flex-1
      ">
        {pricingPackages.map((pkg, idx) => (
          <Card
            key={pkg.name}
            className={`flex flex-col items-center justify-between rounded-[24px] shadow-md px-2 py-4 bg-white
              md:px-6 md:py-8 border-2 ${pkg.recommended ? 'border-dragon-green' : 'border-gray-200'}
            `}
          >
            <CardHeader className="p-0 mb-2 text-center">
              {pkg.recommended && (
                <div className="mb-2">
                  <span className="bg-dragon-green text-white text-xs px-3 py-1 rounded-full">
                    Priporočeno
                  </span>
                </div>
              )}
              <CardTitle className="text-lg md:text-2xl font-bold mb-1">{pkg.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center p-0 mb-2 w-full">
              <div className={`text-2xl md:text-3xl font-extrabold mb-2 ${
                pkg.recommended ? 'text-dragon-green' : 'text-app-blue'
              }`}>
                {pkg.price}
              </div>
              
              <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">
                <strong>Plačilo:</strong> {pkg.description}
              </div>
              
              <div className={`text-xs md:text-sm mb-4 text-center font-medium ${
                pkg.recommended ? 'text-dragon-green' : 'text-gray-500'
              }`}>
                {pkg.savings}
              </div>
              
              {/* Features - showing key highlights only for homepage */}
              <ul className="mb-3 w-full px-3 md:px-0">
                {pkg.features.slice(0, 4).map((f) => (
                  <li key={f} className="text-[12px] md:text-sm text-gray-800 mb-1 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      pkg.recommended ? 'bg-dragon-green' : 'bg-app-blue'
                    }`} /> 
                    {f}
                  </li>
                ))}
                <li className="text-[12px] md:text-sm text-gray-500 mt-2 text-center">
                  ... in še več
                </li>
              </ul>
            </CardContent>
            
            <Button className={`w-full mt-auto rounded-full text-white font-bold ${
              pkg.recommended 
                ? 'bg-dragon-green hover:bg-dragon-green/80' 
                : 'bg-app-blue hover:bg-app-blue/80'
            }`}>
              {pkg.cta}
            </Button>
          </Card>
        ))}
      </div>
      
      {/* Additional note matching profile section */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Vsak dodatni otrok: <strong>+3,90 € / mesec</strong></p>
      </div>
    </section>
  );
}

export default PricingSection;
