
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
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
    { icon: "🎯", text: "Govorne vaje (po črkah)" },
    { icon: "📊", text: "Govorno jezikovne vaje" },
    { icon: "🎮", text: "Govorne igre" },
    { icon: "🏆", text: "Izzivi za dodatno izboljšanje govora" },
    { icon: "📹", text: "Video navodila logopeda" },
    { icon: "🎤", text: "Snemanje in primerjava z AI" },
    { icon: "📈", text: "Sledenje napredku" },
    { icon: "👶", text: "2 otroka vključena (v osnovi)" },
    { icon: "🐲", text: "Motivacija z zmajčkom Tomijem" }
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
            <h2 className="text-2xl font-bold text-center mb-8">Naročniški paketi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yearly subscription card */}
              <Card 
                className={cn(
                  "border border-app-yellow overflow-hidden transition-all duration-300 hover:shadow-md",
                  selectedPlan === 'yearly' ? "ring-2 ring-app-yellow shadow-lg" : ""
                )}
                onClick={() => handleSelectPlan('yearly')}
              >
                <div className="bg-app-yellow/10 p-4 relative">
                  <span className="absolute top-0 right-0 mr-4 mt-4">
                    {selectedPlan === 'yearly' && <Check className="h-6 w-6 text-app-yellow" />}
                  </span>
                  <div className="text-center mb-2">
                    <span className="bg-app-yellow text-white text-xs px-3 py-1 rounded-full">Priporočeno</span>
                  </div>
                  <h3 className="text-xl font-bold text-center">Letna naročnina</h3>
                  <div className="text-center mt-4">
                    <p className="text-2xl font-bold">9,90 € <span className="text-sm font-normal">/ mesec</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">(skupaj 118,80 €)</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p><strong>Plačilo:</strong> Enkratno letno plačilo</p>
                    <p className="text-app-yellow font-medium">Prihranite več kot 50 % v primerjavi z mesečno naročnino</p>
                    
                    <Separator className="my-4" />
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-app-yellow hover:bg-app-yellow/90 text-white"
                        onClick={() => handleSubscribe('Letna naročnina')}
                      >
                        Izberi letno naročnino
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Monthly subscription card */}
              <Card 
                className={cn(
                  "border border-app-blue overflow-hidden transition-all duration-300 hover:shadow-md",
                  selectedPlan === 'monthly' ? "ring-2 ring-app-blue shadow-lg" : ""
                )}
                onClick={() => handleSelectPlan('monthly')}
              >
                <div className="bg-app-blue/10 p-4 relative">
                  <span className="absolute top-0 right-0 mr-4 mt-4">
                    {selectedPlan === 'monthly' && <Check className="h-6 w-6 text-app-blue" />}
                  </span>
                  <h3 className="text-xl font-bold text-center">Mesečna naročnina</h3>
                  <div className="text-center mt-4">
                    <p className="text-2xl font-bold">19,90 € <span className="text-sm font-normal">/ mesec</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">&nbsp;</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p><strong>Plačilo:</strong> Mesečno plačilo</p>
                    <p className="text-gray-500 dark:text-gray-400">Brez dolgoročne obveznosti</p>
                    
                    <Separator className="my-4" />
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-app-blue hover:bg-app-blue/90 text-white"
                        onClick={() => handleSubscribe('Mesečna naročnina')}
                      >
                        Izberi mesečno naročnino
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Features section */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Vključeno v oba paketa:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-lg">{feature.icon}</span> 
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional note */}
            <div className="mt-6 text-sm bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
              <p className="font-semibold mb-2">Opomba:</p>
              <p>Vsak dodatni otrok: <strong>+3,90 € / mesec</strong></p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
