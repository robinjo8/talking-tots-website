
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CircleDollarSign, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Target,
  BarChart2,
  Gamepad2,
  Trophy,
  Video,
  Mic,
  LineChart,
  Users,
  Sparkles
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SubscriptionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | null>(null);

  const handleSubscribe = (plan: string) => {
    toast.info(`Izbran paket: ${plan}. Funkcionalnost naročanja še ni implementirana.`);
  };

  const handleSelectPlan = (plan: 'yearly' | 'monthly') => {
    setSelectedPlan(plan);
  };

  const features = [
    { icon: <Target className="h-4 w-4 text-dragon-green" />, text: "Govorne vaje (po črkah)" },
    { icon: <BarChart2 className="h-4 w-4 text-app-blue" />, text: "Govorno jezikovne vaje" },
    { icon: <Gamepad2 className="h-4 w-4 text-app-purple" />, text: "Govorne igre" },
    { icon: <Trophy className="h-4 w-4 text-app-orange" />, text: "Izzivi za dodatno izboljšanje govora" },
    { icon: <Video className="h-4 w-4 text-app-teal" />, text: "Video navodila logopeda" },
    { icon: <Mic className="h-4 w-4 text-app-purple" />, text: "Snemanje in primerjava z AI" },
    { icon: <LineChart className="h-4 w-4 text-dragon-green" />, text: "Sledenje napredku" },
    { icon: <Users className="h-4 w-4 text-app-blue" />, text: "2 otroka vključena (v osnovi)" },
    { icon: <Sparkles className="h-4 w-4 text-app-yellow" />, text: "Motivacija z zmajčkom Tomijem" }
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
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Monthly Plan */}
              <Card 
                className={cn(
                  "relative border-2 transition-all duration-300 hover:shadow-lg cursor-pointer",
                  selectedPlan === 'monthly' ? "border-app-blue shadow-lg ring-2 ring-app-blue/20" : "border-gray-200 hover:border-app-blue/50"
                )}
                onClick={() => handleSelectPlan('monthly')}
              >
                <CardContent className="p-6">
                  {selectedPlan === 'monthly' && (
                    <div className="absolute top-4 right-4">
                      <Check className="h-5 w-5 text-app-blue" />
                    </div>
                  )}
                  
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
                    {features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-dragon-green" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-app-blue hover:bg-app-blue/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('Mesečna naročnina');
                    }}
                  >
                    Izberi paket
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card 
                className={cn(
                  "relative border-2 transition-all duration-300 hover:shadow-lg cursor-pointer",
                  selectedPlan === 'yearly' ? "border-dragon-green shadow-lg ring-2 ring-dragon-green/20" : "border-gray-200 hover:border-dragon-green/50"
                )}
                onClick={() => handleSelectPlan('yearly')}
              >
                <CardContent className="p-6">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-dragon-green text-white text-xs px-3 py-1 rounded-full font-medium">
                      Priporočeno
                    </span>
                  </div>
                  
                  {selectedPlan === 'yearly' && (
                    <div className="absolute top-4 right-4">
                      <Check className="h-5 w-5 text-dragon-green" />
                    </div>
                  )}
                  
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
                    {features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-dragon-green" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('Letna naročnina');
                    }}
                  >
                    Izberi paket
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional note */}
            <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
              <p>Vsak dodatni otrok: <strong>+3,90 € / mesec</strong></p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
