
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type PaymentMethodsSectionProps = {
  isExpanded: boolean;
  setIsExpanded: () => void;
};

export function PaymentMethodsSection({ isExpanded, setIsExpanded }: PaymentMethodsSectionProps) {

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10 flex flex-row items-center justify-between cursor-pointer hover:bg-gradient-to-r hover:from-app-teal/15 hover:to-dragon-green/15 transition-colors">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-app-teal" />
              <CardTitle>Plačilne metode</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-app-teal">
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
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground p-6 text-center">
              Trenutno ni dodanih plačilnih metod. Dodaj svojo plačilno metodo za hitrejše plačevanje.
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
