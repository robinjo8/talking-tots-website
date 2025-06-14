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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

export function SubscriptionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { plans, loading } = useSubscriptionPlans();

  const handleSubscribe = (plan: string) => {
    toast.info(`Izbran paket: ${plan}. Funkcionalnost naročanja še ni implementirana.`);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const features = [
    { icon: <Target className="h-5 w-5 text-dragon-green" />, text: "Govorne vaje (po črkah)" },
    { icon: <BarChart2 className="h-5 w-5 text-app-blue" />, text: "Govorno jezikovne vaje" },
    { icon: <Gamepad2 className="h-5 w-5 text-app-purple" />, text: "Govorne igre" },
    { icon: <Trophy className="h-5 w-5 text-app-orange" />, text: "Izzivi za dodatno izboljšanje govora" },
    { icon: <Video className="h-5 w-5 text-app-teal" />, text: "Video navodila logopeda" },
    { icon: <Mic className="h-5 w-5 text-app-purple" />, text: "Snemanje in primerjava z AI" },
    { icon: <LineChart className="h-5 w-5 text-dragon-green" />, text: "Sledenje napredku" },
    { icon: <Users className="h-5 w-5 text-app-blue" />, text: "2 otroka vključena (v osnovi)" },
    { icon: <Sparkles className="h-5 w-5 text-app-yellow" />, text: "Motivacija z zmajčkom Tomijem" }
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
            
            {/* Subscription package cards */}
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Nalaganje paketov...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map(pkg => (
                  <Card
                    key={pkg.id}
                    className={cn(
                      `overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col border 
                      ${selectedPlan === pkg.id ? "ring-2 ring-dragon-green shadow-lg" : ""}
                      `,
                      pkg.order_index === 0 ? "border-dragon-green" : "border-app-blue"
                    )}
                    onClick={() => handleSelectPlan(pkg.id)}
                  >
                    <div className={`p-4 relative ${pkg.order_index === 0 ? "bg-dragon-green/10" : "bg-app-blue/10"}`}>
                      <span className="absolute top-0 right-0 mr-4 mt-4">
                        {selectedPlan === pkg.id && (
                          <Check className="h-6 w-6 text-dragon-green" />
                        )}
                      </span>
                      <div className="text-center mb-2">
                        {pkg.order_index === 0 && (
                          <span className="bg-dragon-green text-white text-xs px-3 py-1 rounded-full">Priporočeno</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-center">{pkg.name}</h3>
                      <div className="text-center mt-4">
                        <p className={`text-2xl font-bold ${pkg.order_index === 0 ? "text-dragon-green" : "text-app-blue"}`}>{pkg.price}</p>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1 text-muted-foreground mb-2">
                        <p>{pkg.description}</p>
                        <Separator className="my-4" />
                        {pkg.features && pkg.features.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Vključuje:</h4>
                            <ul className="list-disc pl-5 text-[13px] md:text-base text-foreground">
                              {pkg.features.map((feat, i) => (
                                <li key={feat + i}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <Button 
                          className={`w-full ${pkg.order_index === 0 ? "bg-dragon-green hover:bg-dragon-green/90" : "bg-app-blue hover:bg-app-blue/90"} text-white`}
                          onClick={() => handleSubscribe(pkg.name)}
                        >
                          {pkg.order_index === 0 ? "Izberi letno naročnino" : "Izberi mesečno naročnino"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Features section */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Vključeno v oba paketa:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {feature.icon}
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
