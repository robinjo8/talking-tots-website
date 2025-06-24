
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="cenik"
      className="w-full bg-white py-10 md:py-16 px-4 border-t border-gray-100"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground">
          Naši paketi so zasnovani posebej za starše in njihove otroke. Izberite paket, ki vam najbolj ustreza.
        </p>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Monthly Plan */}
        <Card className="relative border-2 border-gray-200 hover:border-app-blue/50 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-app-blue mb-2">Mesečna naročnina</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">€19,90</span>
                <span className="text-gray-500">/mesec</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Mesečno plačilo</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">AI pogovori / mesec</span>
                <span className="font-semibold">400</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ročne analize / mesec</span>
                <span className="font-semibold">200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Govorne igre / mesec</span>
                <span className="font-semibold">100</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorne vaje (po črkah)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorno jezikovne vaje</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorne igre</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Video navodila logopeda</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Sledenje napredku</span>
              </div>
            </div>

            <Button className="w-full bg-app-blue hover:bg-app-blue/90 text-white">
              Izberi mesečno naročnino
            </Button>
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card className="relative border-2 border-dragon-green hover:border-dragon-green/70 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-dragon-green text-white text-xs px-3 py-1 rounded-full font-medium">
                Priporočeno
              </span>
            </div>
            
            <div className="text-center mb-6 mt-2">
              <h3 className="text-xl font-bold text-dragon-green mb-2">Letna naročnina</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">€9,90</span>
                <span className="text-gray-500">/mesec</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Enkratno letno plačilo</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">AI pogovori / mesec</span>
                <span className="font-semibold">1.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ročne analize / mesec</span>
                <span className="font-semibold">500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Govorne igre / mesec</span>
                <span className="font-semibold">250</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorne vaje (po črkah)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorno jezikovne vaje</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Govorne igre</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Video navodila logopeda</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-dragon-green" />
                <span>Sledenje napredku</span>
              </div>
            </div>

            <Button className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white">
              Izberi letno naročnino
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional note */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Vsak dodatni otrok: <strong>+3,90 € / mesec</strong></p>
      </div>
    </section>
  );
}

export default PricingSection;
