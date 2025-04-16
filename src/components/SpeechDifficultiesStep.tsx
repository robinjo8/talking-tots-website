
import { useState } from "react";
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface SpeechDifficultiesStepProps {
  onBack: () => void;
  onSubmit: (selectedDifficulties: string[]) => void;
  childName: string;
  initialDifficulties?: string[];
}

export function SpeechDifficultiesStep({ 
  onBack, 
  onSubmit, 
  childName,
  initialDifficulties = [] 
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
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Nazaj
        </Button>
        <h3 className="text-lg font-medium">Izberi govorne težave za {childName}</h3>
      </div>

      <div className="space-y-4">
        {SPEECH_DIFFICULTIES.map((difficulty) => (
          <div
            key={difficulty.id}
            className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-dragon-green/50 hover:bg-sky-50/30 transition-colors"
          >
            <div className="pt-0.5">
              <Checkbox
                id={difficulty.id}
                checked={selectedDifficulties.includes(difficulty.id)}
                onCheckedChange={() => toggleDifficulty(difficulty.id)}
                className="mt-1"
              />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{difficulty.icon}</span>
                <Label
                  htmlFor={difficulty.id}
                  className="text-base font-medium cursor-pointer hover:text-dragon-green"
                >
                  {difficulty.title}
                </Label>
              </div>
              <p className="text-sm text-gray-600">{difficulty.description}</p>
              {difficulty.example && (
                <p className="text-sm text-gray-500 italic">{difficulty.example}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">💡 Opomba za starše:</p>
          <p className="text-sm text-amber-700">
            Če opazite katerega od teh znakov, je priporočljivo posvetovanje z logopedom. 
            Zgodnje odkrivanje težav omogoča lažje in hitrejše odpravljanje.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
      >
        Zaključi registracijo
      </Button>
    </div>
  );
}
