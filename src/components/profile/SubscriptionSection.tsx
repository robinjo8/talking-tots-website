
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CircleDollarSign, 
  ChevronDown, 
  ChevronUp, 
  Target,
  Gamepad2,
  Video,
  BookOpen,
  MessageCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SubscriptionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = (plan: string) => {
    toast.info(`Izbran paket: ${plan}. Funkcionalnost naročanja še ni implementirana.`);
  };

  const features = [
    { icon: <Target className="h-4 w-4 text-dragon-green" />, text: "Napredno testiranje izgovorjave" },
    { icon: <Gamepad2 className="h-4 w-4 text-app-purple" />, text: "Dostop do govornih vaj in iger" },
    { icon: <Video className="h-4 w-4 text-app-teal" />, text: "Video navodila logopeda" },
    { icon: <BookOpen className="h-4 w-4 text-app-orange" />, text: "Logopedski kotiček za starše" },
    { icon: <MessageCircle className="h-4 w-4 text-app-blue" />, text: "Pogovor s pametnim AI asistentom" },
    { icon: <TrendingUp className="h-4 w-4 text-dragon-green" />, text: "Sledenje napredku otroka" },
    { icon: <FileText className="h-4 w-4 text-app-purple" />, text: "Prilagojen govorni načrt" }
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
      <Card>
        <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-app-yellow" />
            <CardTitle>Naročnina</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-app-yellow hover:bg-app-yellow/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="hidden md:inline">Skrij podrobnosti</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="hidden md:inline">Prikaži podrobnosti</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto">
              {/* Plan Toggle */}
              <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')} className="w-full mb-8">
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

                      <Button 
                        className="w-full bg-app-blue hover:bg-app-blue/90 text-white h-12 text-lg font-semibold"
                        onClick={() => handleSubscribe('Mesečna naročnina')}
                      >
                        Nadgradi
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

                      <Button 
                        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white h-12 text-lg font-semibold"
                        onClick={() => handleSubscribe('Letna naročnina')}
                      >
                        Nadgradi
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Additional note */}
              <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                <p>Vsak dodatni otrok: <strong>+3,90 € / mesec</strong></p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
