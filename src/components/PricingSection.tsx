import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingFeaturesList, featuresTexts } from "./pricing/PricingFeaturesList";

// Synchronized subscription data matching the profile section exactly
const pricingPackages = [
  {
    name: "Letna naročnina",
    price: "9,90 € / mesec",
    originalPrice: null,
    description: "Enkratno letno plačilo",
    savings: "Prihranite več kot 50 % v primerjavi z mesečno naročnino",
    features: featuresTexts,
    cta: "Izberi letno naročnino",
    recommended: true
  },
  {
    name: "Mesečna naročnina", 
    price: "19,90 € / mesec",
    originalPrice: null,
    description: "Mesečno plačilo",
    savings: "Brez dolgoročne obveznosti",
    features: featuresTexts,
    cta: "Izberi mesečno naročnino",
    recommended: false
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
      
      {/* Cards layout */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto
        [&>*]:flex-1
      ">
        {pricingPackages.map((pkg) => (
          <div
            key={pkg.name}
            className={`flex flex-col rounded-[24px] shadow-md px-2 py-4 md:px-6 md:py-8 border-2 ${
              pkg.recommended ? 'border-dragon-green bg-dragon-green/5' : 'border-app-blue bg-app-blue/5'
            }`}
          >
            {/* Card header */}
            <div className="mb-4">
              {pkg.recommended && (
                <div className="flex justify-center mb-2">
                  <span className="bg-dragon-green text-white text-xs px-3 py-1 rounded-full">
                    Priporočeno
                  </span>
                </div>
              )}
              <h3 className="text-lg md:text-2xl font-bold text-center">{pkg.name}</h3>
            </div>
            {/* Price */}
            <div className={`text-2xl md:text-3xl font-extrabold mb-2 text-center ${
              pkg.recommended ? 'text-dragon-green' : 'text-app-blue'
            }`}>
              {pkg.price}
            </div>
            {/* Payment description */}
            <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">
              <strong>Plačilo:</strong> {pkg.description}
            </div>
            
            {/* Savings info */}
            <div className={`text-xs md:text-sm mb-4 text-center font-medium ${
              pkg.recommended ? 'text-dragon-green' : 'text-gray-500'
            }`}>
              {pkg.savings}
            </div>

            {/* Features - always full, like profile */}
            <div className="py-2 px-2 md:px-0 mb-2">
              <PricingFeaturesList />
            </div>
            
            {/* Call to action */}
            <button className={`w-full rounded-full text-white font-bold mt-auto py-3 text-base ${
                pkg.recommended 
                  ? 'bg-dragon-green hover:bg-dragon-green/90' 
                  : 'bg-app-blue hover:bg-app-blue/90'
              }`}>
              {pkg.cta}
            </button>
          </div>
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
