import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EvaluationOption } from '@/data/evaluationOptions';
import { ArticulationRatingScale } from './ArticulationRatingScale';

interface EvaluationCheckboxesProps {
  options: EvaluationOption[];
  selectedOptions: string[];
  comment: string;
  rating?: number;
  onOptionsChange: (options: string[]) => void;
  onCommentChange: (comment: string) => void;
  onRatingChange: (rating: number | undefined) => void;
  disabled?: boolean;
}

export function EvaluationCheckboxes({
  options,
  selectedOptions,
  comment,
  rating,
  onOptionsChange,
  onCommentChange,
  onRatingChange,
  disabled = false,
}: EvaluationCheckboxesProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (disabled) return;
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
              disabled={option.disabled || disabled}
            />
            <Label
              htmlFor={option.id}
              className={`text-sm cursor-pointer ${(option.disabled || disabled) ? 'text-muted-foreground opacity-60' : 'text-foreground'}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      {/* 5-stopenjska ocenjevalna lestvica */}
      <ArticulationRatingScale
        selectedRating={rating}
        onRatingChange={onRatingChange}
        disabled={disabled}
      />

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
          disabled={disabled}
        />
      </div>
    </div>
  );
}
