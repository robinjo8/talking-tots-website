
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function SubscriptionSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubscribe = (plan: string) => {
    toast.info(`Izbran paket: ${plan}. Funkcionalnost naročanja še ni implementirana.`);
  };

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
            
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[600px]">
                {/* First column - Titles */}
                <div className="space-y-8 pt-12">
                  <p className="font-semibold">Cena</p>
                  <p className="font-semibold">Plačilo</p>
                  <div>
                    <p className="font-semibold">Vključuje <span className="italic font-normal">(za oba paketa)</span></p>
                  </div>
                </div>
                
                {/* Annual subscription */}
                <div className="rounded-lg border border-app-yellow bg-app-yellow/5 p-4">
                  <div className="text-center font-bold text-lg py-2 mb-6">Letna naročnina</div>
                  <div className="space-y-8">
                    <p className="font-medium">9,90 € / mesec <span className="italic">(skupaj 118,80 €)</span></p>
                    <p>Enkratno letno plačilo</p>
                    <div className="invisible">placeholder</div>
                  </div>
                </div>
                
                {/* Monthly subscription */}
                <div className="rounded-lg border border-app-blue bg-app-blue/5 p-4">
                  <div className="text-center font-bold text-lg py-2 mb-6">Mesečna naročnina</div>
                  <div className="space-y-8">
                    <p className="font-medium">19,90 € / mesec</p>
                    <p>Mesečno plačilo</p>
                    <div className="invisible">placeholder</div>
                  </div>
                </div>
              </div>
              
              {/* Features list that applies to both */}
              <div className="mt-4 pl-[33%] md:pl-[calc(33.333%+1rem)] py-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🎯</span> 
                    <span>Govorne vaje (po črkah)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📊</span>
                    <span>Govorno jezikovne vaje</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🎮</span>
                    <span>Govorne igre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🏆</span>
                    <span>Izzivi za dodatno izboljšanje govora</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📹</span>
                    <span>Video navodila logopeda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🎤</span>
                    <span>Snemanje in primerjava z AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📈</span>
                    <span>Sledenje napredku</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">👶</span>
                    <span>2 otroka vključena (v osnovi)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🐲</span>
                    <span>Motivacija z zmajčkom Tomijem</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
              <p className="font-semibold mb-2">Opomba:</p>
              <ul className="space-y-2">
                <li>Vsak dodatni otrok: +3,90 € / mesec</li>
                <li className="font-medium text-app-yellow">
                  Letna naročnina ti prihrani več kot 50 % v primerjavi z mesečno
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Button 
                className="bg-app-yellow hover:bg-app-yellow/90 text-white"
                variant="default"
                onClick={() => handleSubscribe('Letna naročnina')}
              >
                Izberi letno naročnino
              </Button>
              <Button 
                className="bg-app-blue hover:bg-app-blue/90 text-white"
                variant="default"
                onClick={() => handleSubscribe('Mesečna naročnina')}
              >
                Izberi mesečno naročnino
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
