
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SpeechHeaderProps {
  onBack: () => void;
  childName: string;
  title: string;
  showBackButton?: boolean;
}

export function SpeechHeader({ 
  onBack, 
  childName,
  title,
  showBackButton = false 
}: SpeechHeaderProps) {
  return (
    <div className="mb-6">
      {showBackButton && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Nazaj
        </Button>
      )}
      
      <h2 className="text-xl font-bold text-center">
        {title} <span className="text-dragon-green font-extrabold">{childName}</span>
      </h2>
    </div>
  );
}
