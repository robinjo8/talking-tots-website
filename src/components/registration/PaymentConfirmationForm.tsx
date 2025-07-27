import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Target, Gamepad2, Video, BookOpen, MessageCircle, TrendingUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentConfirmationFormProps = {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  onBack: () => void;
};
export function PaymentConfirmationForm({
  selectedPlan,
  setSelectedPlan,
  onBack
}: PaymentConfirmationFormProps) {
  const features = [
    { icon: <Target className="h-4 w-4 text-dragon-green" />, text: "Napredno testiranje izgovorjava" },
    { icon: <Gamepad2 className="h-4 w-4 text-app-purple" />, text: "Dostop do govornih vaj in iger" },
    { icon: <Video className="h-4 w-4 text-app-teal" />, text: "Video navodila logopeda" },
    { icon: <BookOpen className="h-4 w-4 text-app-orange" />, text: "Logopedski nasveti za starše" },
    { icon: <MessageCircle className="h-4 w-4 text-app-blue" />, text: "Pogovor s pametnim AI asistentom" },
    { icon: <TrendingUp className="h-4 w-4 text-dragon-green" />, text: "Sledenje napredku otroka" },
    { icon: <FileText className="h-4 w-4 text-app-purple" />, text: "Prilagojen govorni načrt" }
  ];

  return (
    <div className="space-y-6">
      <div className="w-full px-4 mx-auto text-center mb-6 md:mb-10">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          Naši paketi so zasnovani posebej za starše in njihove otroke. Izberite paket, ki vam najbolj ustreza.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Plan Toggle */}
        <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Plačuj mesečno
            </TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative">
              Prihrani letno
              <span className="absolute -top-2 -right-2 bg-app-orange text-white text-xs px-2 py-0.5 rounded-full font-medium">
                -54%
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-app-blue mb-2">Mesečna naročnina</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">22 €</span>
                    <span className="text-gray-500">/mesec</span>
                  </div>
                  <p className="text-sm text-gray-600">zaračunano mesečno</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      {feature.icon}
                      <span>{feature.text}</span>
                    </div>
                  ))}
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
                  <span className="bg-app-orange text-white text-sm px-4 py-1 rounded-full font-medium">
                    Večina staršev izbere
                  </span>
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-dragon-green mb-2">Letna naročnina</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">10 €</span>
                    <span className="text-gray-500">/mesec</span>
                  </div>
                  <p className="text-sm text-gray-600">zaračunano letno</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    "Vse, kar potrebuje otrok, da izboljša govor!"
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      {feature.icon}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white h-12 text-lg font-semibold">
                  Izberi letno naročnino
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>
    </div>
  );
}