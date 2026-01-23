import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EvaluationOption } from '@/data/evaluationOptions';

interface EvaluationCheckboxesProps {
  options: EvaluationOption[];
  selectedOptions: string[];
  comment: string;
  onOptionsChange: (options: string[]) => void;
  onCommentChange: (comment: string) => void;
}

export function EvaluationCheckboxes({
  options,
  selectedOptions,
  comment,
  onOptionsChange,
  onCommentChange,
}: EvaluationCheckboxesProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onOptionsChange([...selectedOptions, optionId]);
    } else {
      onOptionsChange(selectedOptions.filter(id => id !== optionId));
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      {/* Check boxi v mreži 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
              disabled={option.disabled}
            />
            <Label
              htmlFor={option.id}
              className={`text-sm cursor-pointer ${option.disabled ? 'text-muted-foreground opacity-60' : 'text-foreground'}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Komentar */}
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm text-muted-foreground">
          Komentar
        </Label>
        <Textarea
          id="comment"
          placeholder="Dodatne opombe..."
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="min-h-[60px] resize-none"
        />
      </div>
    </div>
  );
}
