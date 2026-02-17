
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import type { ChildProfile } from "@/hooks/useRegistration";
import { SpeechDifficultyBadge } from "@/components/speech";

interface ChildCompletedViewProps {
  child: ChildProfile;
  onClose: () => void;
  closeButtonText?: string;
  isPro?: boolean;
}

export function ChildCompletedView({ 
  child, 
  onClose,
  closeButtonText = "Zaključi dodajanje otroka",
  isPro = false
}: ChildCompletedViewProps) {
  const getAnswerLabels = (answers: Record<string, string> = {}) => {
    const labelMap: Record<string, string> = {
      yes: "Da",
      no: "Ne",
      sometimes: "Včasih",
      often: "Pogosto",
      rarely: "Redko"
    };
    
    return Object.entries(answers).map(([key, value]) => ({
      id: key,
      answer: labelMap[value] || value
    }));
  };
  
  const answerItems = child.speechDevelopment ? getAnswerLabels(child.speechDevelopment) : [];

  return (
    <div className="space-y-6">
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-1.5">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profil uspešno zaključen</h3>
            <p className="text-sm text-gray-600">
              Profil otroka je zdaj pripravljen za uporabo v aplikaciji.
            </p>
          </div>
        </div>
      </Card>

      <Button
        onClick={onClose}
        className="w-full bg-orange-500 hover:bg-orange-600 text-base font-medium py-6"
      >
        {closeButtonText}
      </Button>
      
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-semibold text-lg py-2 group">
          Osnovni podatki
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-white rounded-lg border p-4 space-y-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Ime</span>
              <span className="font-medium">{child.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Spol</span>
              <span className="font-medium">{child.gender === "M" ? "Deček" : "Deklica"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Datum rojstva</span>
              <span className="font-medium">
                {child.birthDate 
                  ? format(child.birthDate, "dd.MM.yyyy")
                  : "Ni podan"}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {isPro && child.speechDifficulties && child.speechDifficulties.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full font-semibold text-lg py-2 group">
            Govorne težave
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {child.speechDifficulties.map(diffId => (
                <SpeechDifficultyBadge 
                  key={diffId} 
                  difficultyId={diffId}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {isPro && answerItems.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full font-semibold text-lg py-2 group">
            Odgovori na vprašalnik
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white rounded-lg border divide-y mt-2">
              {answerItems.map((item, index) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <span className="text-gray-700">Vprašanje {index + 1}</span>
                  <Badge 
                    variant={item.answer === "Da" ? "success" : 
                           item.answer === "Ne" ? "outline" : "secondary"}
                  >
                    {item.answer}
                  </Badge>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
