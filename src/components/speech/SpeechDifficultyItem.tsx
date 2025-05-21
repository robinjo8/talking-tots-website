
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SpeechDifficulty } from "@/models/SpeechDifficulties";

interface SpeechDifficultyItemProps {
  difficulty: SpeechDifficulty;
  isSelected: boolean;
  onToggleSelect: (difficultyId: string) => void;
}

export function SpeechDifficultyItem({ 
  difficulty, 
  isSelected, 
  onToggleSelect 
}: SpeechDifficultyItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col p-4 rounded-lg border border-gray-200 hover:border-dragon-green/50 hover:bg-sky-50/30 transition-colors">
      <div className="flex gap-3">
        <div className="pt-0.5">
          <Checkbox
            id={difficulty.id}
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(difficulty.id)}
            className="mt-1"
          />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{difficulty.icon}</span>
              <Label
                htmlFor={difficulty.id}
                className="text-base font-medium cursor-pointer hover:text-dragon-green"
              >
                {difficulty.title}
              </Label>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          
          {isExpanded && (
            <div className="pt-2 space-y-2">
              <p className="text-sm text-gray-600">{difficulty.description}</p>
              {difficulty.example && (
                <p className="text-sm text-gray-500 italic">{difficulty.example}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
