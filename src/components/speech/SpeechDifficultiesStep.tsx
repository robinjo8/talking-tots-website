
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeechHeader } from "./SpeechHeader";
import { SpeechDifficultyItem } from "./SpeechDifficultyItem";
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SpeechDifficultiesStepProps {
  onBack: () => void;
  onSubmit: (difficulties: string[]) => void;
  childName: string;
  initialDifficulties?: string[];
  submitButtonText?: string;
  showDetailToggle?: boolean;
}

export function SpeechDifficultiesStep({
  onBack,
  onSubmit,
  childName,
  initialDifficulties = [],
  submitButtonText = "Zaključi registracijo",
  showDetailToggle = false
}: SpeechDifficultiesStepProps) {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(initialDifficulties);
  const [openDescriptions, setOpenDescriptions] = useState<Record<string, boolean>>({});

  const toggleDifficulty = (id: string) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleDescription = (id: string) => {
    setOpenDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = () => {
    onSubmit(selectedDifficulties);
  };

  return (
    <div className="space-y-6">
      <SpeechHeader 
        onBack={onBack}
        childName={childName} 
        title="Govorne motnje za"
      />

      <div className="space-y-4">
        {SPEECH_DIFFICULTIES.map((difficulty) => (
          <div key={difficulty.id} className="border rounded-lg overflow-hidden">
            <div 
              className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleDifficulty(difficulty.id)}
            >
              <input
                type="checkbox"
                checked={selectedDifficulties.includes(difficulty.id)}
                onChange={() => {}}
                className="h-4 w-4 text-dragon-green focus:ring-dragon-green mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{difficulty.icon}</span>
                  <span className="font-medium">{difficulty.title}</span>
                </div>
              </div>
              {showDetailToggle && (
                <CollapsibleTrigger 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDescription(difficulty.id);
                  }}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  {openDescriptions[difficulty.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
              )}
            </div>
            
            {showDetailToggle ? (
              <Collapsible open={openDescriptions[difficulty.id]}>
                <CollapsibleContent className="px-4 pb-4 pt-0 border-t">
                  <p className="text-sm text-gray-600 mt-2">{difficulty.description}</p>
                  {difficulty.example && (
                    <p className="text-sm text-gray-500 mt-1 italic">{difficulty.example}</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="px-4 pb-4 pt-0 border-t">
                <p className="text-sm text-gray-600 mt-2">{difficulty.description}</p>
                {difficulty.example && (
                  <p className="text-sm text-gray-500 mt-1 italic">{difficulty.example}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
      >
        {submitButtonText}
      </Button>
    </div>
  );
}
