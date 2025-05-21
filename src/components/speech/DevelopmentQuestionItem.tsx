
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionOption {
  value: string;
  label: string;
}

interface DevelopmentQuestionItemProps {
  id: string;
  question: string;
  options: QuestionOption[];
  selectedValue: string;
  onValueChange: (questionId: string, value: string) => void;
}

export function DevelopmentQuestionItem({
  id,
  question,
  options,
  selectedValue,
  onValueChange
}: DevelopmentQuestionItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <Label className="text-base font-medium mb-3 block">
        {question}
      </Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={(value) => onValueChange(id, value)}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
