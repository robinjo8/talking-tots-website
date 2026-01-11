import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<'start' | 'plus' | 'pro'>('pro');
  const [showMobileDialog, setShowMobileDialog] = useState(false);

  const startFeatures = [
    "Interaktivne govornih igre",
    "Vaje za izgovorjavo glasov",
    "Vaje motorike govoril",
    "Video navodila logopeda",
    "Logopedski nasveti za starše",
    "Spodbujevalni model nagrajevanja"
  ];

  const plusFeatures = [
    "Interaktivne govornih igre",
    "Vaje za izgovorjavo glasov",
    "Vaje motorike govoril",
    "Video navodila logopeda",
    "Logopedski nasveti za starše",
    "Spodbujevalni model nagrajevanja",
    "Dostop do vseh novih vsebin",
    "Razširjene igre"
  ];

  const plusIncludedFeatures = [
    "Interaktivne govornih igre",
    "Vaje za izgovorjavo glasov",
    "Vaje motorike govoril",
    "Video navodila logopeda",
    "Logopedski nasveti za starše",
    "Spodbujevalni model nagrajevanja",
    "Dostop do vseh novih vsebin",
    "Razširjene igre"
  ];

  const proFeatures = [
    { text: "Vse iz TomiTalk Plus", isBold: true, hasInfo: true },
    { text: "Prilagojen osebni načrt", isBold: false, hasInfo: false },
    { text: "Preverjanje izgovorjave", isBold: false, hasInfo: false },
    { text: "Strokovna obravnava govora", isBold: false, hasInfo: false },
    { text: "Logopedska poročila", isBold: false, hasInfo: false },
    { text: "Spremljanje napredka z razlago", isBold: false, hasInfo: false },
    { text: "Dostop do vseh novih AI vsebin", isBold: false, hasInfo: false },
    { text: "Klepet", isBold: false, hasInfo: false }
  ];

  return (
    <section id="cenik" className="w-full bg-white py-4 md:py-16 px-4 h-full md:h-auto">
      <div className="max-w-3xl md:max-w-5xl mx-auto text-center mb-4 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">TomiTalk paketi</h2>
        <p className="text-sm md:text-lg text-muted-foreground whitespace-nowrap">
          Izberite svoj TomiTalk paket in začnite danes.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Plan Toggle */}
        <Tabs value={selectedPlan} onValueChange={value => setSelectedPlan(value as 'start' | 'plus' | 'pro')} className="w-full mb-4 md:mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 h-10 md:h-12">
            <TabsTrigger value="start" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm md:text-base">
              <span className="md:hidden">Start</span>
              <span className="hidden md:inline">TomiTalk Start</span>
            </TabsTrigger>
            <TabsTrigger value="plus" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm md:text-base">
              <span className="md:hidden">Plus</span>
              <span className="hidden md:inline">TomiTalk Plus</span>
            </TabsTrigger>
            <TabsTrigger value="pro" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative text-sm md:text-base">
              <span className="md:hidden">Pro</span>
              <span className="hidden md:inline">TomiTalk Pro</span>
              <span className="absolute -top-2 -right-2 bg-dragon-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Naj izbira
              </span>
            </TabsTrigger>
          </TabsList>

          {/* TomiTalk Start */}
          <TabsContent value="start" className="mt-4 md:mt-6">
            <Card className={cn("relative border-2 transition-all duration-300 hover:shadow-lg h-[360px] md:h-[580px]", "border-app-blue shadow-md")}>
              <CardContent className="p-3 md:p-8 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-app-blue text-white text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-medium whitespace-nowrap">
                    Fleksibilno
                  </span>
                </div>
                
                <div className="text-center mb-2 md:mb-6 mt-2 md:h-[88px]">
                  <h3 className="text-xl md:text-2xl font-bold text-app-blue mb-1 md:mb-2">TomiTalk Start</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1 md:mb-2">
                    <span className="text-3xl md:text-4xl font-bold">17 €</span>
                    <span className="text-gray-500 text-sm md:text-base">/mesec</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">zaračunano mesečno</p>
                </div>

                <div className="text-center mb-2 md:mb-6">
                  <p className="text-sm md:text-lg font-medium text-gray-700 mb-1 md:mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="flex justify-center mb-3 md:mb-6">
                  <div className="inline-flex flex-col items-start space-y-0.5 md:space-y-3">
                    {startFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-app-blue flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-app-blue hover:bg-app-blue/90 text-white h-9 md:h-12 text-sm md:text-lg font-semibold mt-auto">
                  Izberi TomiTalk Start
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TomiTalk Plus */}
          <TabsContent value="plus" className="mt-4 md:mt-6">
            <Card className={cn("relative border-2 transition-all duration-300 hover:shadow-lg h-[360px] md:h-[580px]", "border-app-orange shadow-md")}>
              <CardContent className="p-3 md:p-8 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-app-orange text-white text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-medium whitespace-nowrap">
                    Prihranek
                  </span>
                </div>
                
                <div className="text-center mb-2 md:mb-6 mt-2 md:h-[88px]">
                  <h3 className="text-xl md:text-2xl font-bold text-app-orange mb-1 md:mb-2">TomiTalk Plus</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1 md:mb-2">
                    <span className="text-3xl md:text-4xl font-bold">8 €</span>
                    <span className="text-gray-500 text-sm md:text-base">/mesec</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">zaračunano letno</p>
                </div>

                <div className="text-center mb-2 md:mb-6">
                  <p className="text-sm md:text-lg font-medium text-gray-700 mb-1 md:mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="flex justify-center mb-3 md:mb-6">
                  <div className="inline-flex flex-col items-start space-y-0.5 md:space-y-3">
                    {plusFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-app-orange flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-app-orange hover:bg-app-orange/90 text-white h-9 md:h-12 text-sm md:text-lg font-semibold mt-auto">
                  Izberi TomiTalk Plus
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TomiTalk Pro */}
          <TabsContent value="pro" className="mt-4 md:mt-6">
            <Card className={cn("relative border-2 transition-all duration-300 hover:shadow-lg h-[360px] md:h-[580px]", "border-dragon-green shadow-md")}>
              <CardContent className="p-3 md:p-8 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-dragon-green text-white text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-medium whitespace-nowrap">
                    Naj izbira
                  </span>
                </div>
                
                <div className="text-center mb-2 md:mb-6 mt-2 md:h-[88px]">
                  <h3 className="text-xl md:text-2xl font-bold text-dragon-green mb-1 md:mb-2">TomiTalk Pro</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1 md:mb-2">
                    <span className="text-3xl md:text-4xl font-bold">13 €</span>
                    <span className="text-gray-500 text-sm md:text-base">/mesec</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">zaračunano letno</p>
                </div>

                <div className="text-center mb-2 md:mb-6">
                  <p className="text-sm md:text-lg font-medium text-gray-700 mb-1 md:mb-4">
                    "Razširjena strokovna podpora in osebni pristop."
                  </p>
                </div>

                <div className="flex justify-center mb-3 md:mb-6">
                  <div className="inline-flex flex-col items-start space-y-0.5 md:space-y-3">
                    {proFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-dragon-green flex-shrink-0" />
                        <span className={feature.isBold ? "font-bold" : ""}>{feature.text}</span>
                        {feature.hasInfo && (
                          <>
                            {/* Desktop: Popover */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="hidden md:block text-gray-400 hover:text-dragon-green transition-colors">
                                  <HelpCircle className="h-4 w-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-3" side="bottom" sideOffset={5}>
                                <p className="font-semibold text-sm mb-2">TomiTalk Plus vključuje:</p>
                                <ul className="space-y-1">
                                  {plusIncludedFeatures.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs">
                                      <div className="h-1.5 w-1.5 rounded-full bg-app-orange flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </PopoverContent>
                            </Popover>
                            
                            {/* Mobile: Dialog trigger */}
                            <button 
                              className="md:hidden text-gray-400 hover:text-dragon-green transition-colors"
                              onClick={() => setShowMobileDialog(true)}
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white h-9 md:h-12 text-sm md:text-lg font-semibold mt-auto">
                  Izberi TomiTalk Pro
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Dialog for TomiTalk Pro info */}
      <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
        <DialogContent className="w-[90%] max-w-sm rounded-xl p-0 overflow-hidden">
          <div className="bg-dragon-green text-white p-4 text-center">
            <DialogTitle className="text-lg font-bold text-white">TomiTalk Pro vključuje</DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Celoten paket za napredek govora
            </DialogDescription>
          </div>
          
          <div className="p-4">
            {/* TomiTalk Plus section */}
            <div className="bg-app-orange/10 border-2 border-app-orange rounded-lg p-3 mb-4">
              <p className="font-bold text-app-orange text-sm mb-2 text-center">
                ✓ Vse iz TomiTalk Plus:
              </p>
              <ul className="space-y-1.5">
                {plusIncludedFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-app-orange flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* TomiTalk Pro exclusive features */}
            <div className="bg-dragon-green/10 border-2 border-dragon-green rounded-lg p-3">
              <p className="font-bold text-dragon-green text-sm mb-2 text-center">
                + Ekskluzivne Pro funkcije:
              </p>
              <ul className="space-y-1.5">
                {proFeatures.filter(f => !f.hasInfo).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-dragon-green flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default PricingSection;
