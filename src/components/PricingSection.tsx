
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [includeGovornoUcniNacrt, setIncludeGovornoUcniNacrt] = useState(false);

  const features = [
    "Preverjanje izgovorjave",
    "Dostop do govornih vaj in iger",
    "Video navodila logopeda",
    "Logopedski nasveti za starše",
    "Poročila o napredku",
    "Sledenje napredku otroka",
    "Pogovor s pametnim AI asistentom",
    "Dostop do vseh novih vsebin"
  ];

  const addonPrice = selectedPlan === 'monthly' ? 49 : 29;

  return (
    <section
      id="cenik"
      className="w-full bg-white py-10 md:py-16 px-4"
    >
      <div className="max-w-3xl md:max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground md:whitespace-nowrap">
          Naši paketi so zasnovani posebej za starše in njihove otroke. Izberite paket, ki vam najbolj ustreza.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Plan Toggle */}
        <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 h-12">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-base">
              Mesečno
            </TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative text-base">
              Letno
              <span className="absolute -top-2 -right-2 bg-app-orange text-white text-xs px-2 py-0.5 rounded-full font-medium">
                -53%
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="mt-6">
            <Card 
              className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg",
                "border-app-blue shadow-md"
              )}
            >
              <CardContent className="p-8">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-app-blue text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap">
                    Fleksibilno
                  </span>
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-app-blue mb-2">Mesečna naročnina</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">15 €</span>
                    <span className="text-gray-500">/mesec</span>
                  </div>
                  <p className="text-sm text-gray-600">zaračunano mesečno</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="space-y-3 mb-6 flex flex-col items-center">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-dragon-green flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Optional Add-on */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="addon-monthly"
                      checked={includeGovornoUcniNacrt}
                      onCheckedChange={(checked) => setIncludeGovornoUcniNacrt(checked as boolean)}
                      className="mt-0.5"
                    />
                    <label htmlFor="addon-monthly" className="text-sm cursor-pointer">
                      <span className="font-medium">Prilagojen govorno učni načrt</span>
                      <span className="text-app-orange font-semibold ml-2">+{addonPrice} €</span>
                      <p className="text-gray-500 text-xs mt-1">Na podlagi otrokove starosti in govorne težave pripravimo osebno prilagojen načrt vaj in iger. Otrok vadi točno tisto, kar potrebuje, staršem pa ponuja jasen pregled in spremljanje razvoja.</p>
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-app-blue hover:bg-app-blue/90 text-white h-12 text-lg font-semibold">
                  Izberi mesečno naročnino
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yearly" className="mt-6">
            <Card 
              className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg",
                "border-dragon-green shadow-md"
              )}
            >
              <CardContent className="p-8">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-app-orange text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap">
                    Večina staršev izbere
                  </span>
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-dragon-green mb-2">Letna naročnina</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl text-gray-400 line-through">15 €</span>
                    <span className="text-4xl font-bold">7 €</span>
                    <span className="text-gray-500">/mesec</span>
                    <span className="bg-dragon-green/10 text-dragon-green text-sm px-2 py-0.5 rounded-full font-semibold">
                      -53%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">zaračunano letno</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="space-y-3 mb-6 flex flex-col items-center">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-dragon-green flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Optional Add-on */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="addon-yearly"
                      checked={includeGovornoUcniNacrt}
                      onCheckedChange={(checked) => setIncludeGovornoUcniNacrt(checked as boolean)}
                      className="mt-0.5"
                    />
                    <label htmlFor="addon-yearly" className="text-sm cursor-pointer">
                      <span className="font-medium">Prilagojen govorno učni načrt</span>
                      <span className="text-app-orange font-semibold ml-2">+{addonPrice} €</span>
                      <p className="text-gray-500 text-xs mt-1">Na podlagi otrokove starosti in govorne težave pripravimo osebno prilagojen načrt vaj in iger. Otrok vadi točno tisto, kar potrebuje, staršem pa ponuja jasen pregled in spremljanje razvoja.</p>
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white h-12 text-lg font-semibold">
                  Izberi letno naročnino
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default PricingSection;
