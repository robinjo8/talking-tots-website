
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextQuestionItemProps {
  id: string;
  question: string;
  placeholder?: string;
  required: boolean;
  value: string;
  onValueChange: (questionId: string, value: string) => void;
}

export function TextQuestionItem({
  id,
  question,
  placeholder,
  required,
  value,
  onValueChange
}: TextQuestionItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <Label className="text-base font-medium mb-3 block">
        {question}
        {!required && (
          <span className="text-muted-foreground font-normal text-sm ml-2">(opcijsko)</span>
        )}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onValueChange(id, e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
}
