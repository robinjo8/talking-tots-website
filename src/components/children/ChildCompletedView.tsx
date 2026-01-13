
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Check, CheckCircle2 } from "lucide-react";

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
  closeButtonText = "Zaključi registracijo",
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
      
      <div>
        <h3 className="font-semibold text-lg mb-4">Osnovni podatki</h3>
        <div className="bg-white rounded-lg border p-4 space-y-2">
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
      </div>
      
      {/* Only show speech difficulties section for Pro users */}
      {isPro && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Govorne težave</h3>
          {child.speechDifficulties && child.speechDifficulties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {child.speechDifficulties.map(diffId => (
                <SpeechDifficultyBadge 
                  key={diffId} 
                  difficultyId={diffId}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Ni izbranih govornih težav</p>
          )}
        </div>
      )}
      
      {/* Only show questionnaire section for Pro users */}
      {isPro && answerItems.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Odgovori na vprašalnik</h3>
          <div className="bg-white rounded-lg border divide-y">
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
        </div>
      )}
      
      <div className="flex flex-col space-y-4 pt-4">
        <Button
          onClick={onClose}
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
        >
          {closeButtonText}
        </Button>
      </div>
    </div>
  );
}
