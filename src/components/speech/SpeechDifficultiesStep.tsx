
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { SpeechHeader } from "./SpeechHeader";
import { SpeechDifficultyList } from "./SpeechDifficultyList";

interface SpeechDifficultiesStepProps {
  onBack: () => void;
  onSubmit: (selectedDifficulties: string[]) => void;
  childName: string;
  initialDifficulties?: string[];
  submitButtonText?: string;
}

export function SpeechDifficultiesStep({ 
  onBack, 
  onSubmit, 
  childName,
  initialDifficulties = [],
  submitButtonText = "Naprej"
}: SpeechDifficultiesStepProps) {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(initialDifficulties);

  const toggleDifficulty = (difficultyId: string) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficultyId)) {
        return prev.filter(id => id !== difficultyId);
      } else {
        return [...prev, difficultyId];
      }
    });
  };

  const handleSubmit = () => {
    onSubmit(selectedDifficulties);
  };

  return (
    <div className="space-y-6">
      <SpeechHeader 
        onBack={onBack} 
        childName={childName}
        title="Izberi govorne motnje za"
        showBackButton={false}
      />

      <SpeechDifficultyList
        selectedDifficulties={selectedDifficulties}
        onToggleDifficulty={toggleDifficulty}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">💡 Opomba za starše:</p>
          <p className="text-sm text-amber-700">
            Če opazite katerega od teh znakov, je priporočljivo posvetovanje z logopedom. 
            Zgodnje odkrivanje motenj omogoča lažje in hitrejše odpravljanje.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
      >
        {submitButtonText}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="w-full flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>
    </div>
  );
}
