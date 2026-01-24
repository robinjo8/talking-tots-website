import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RATING_SCALE } from '@/data/evaluationOptions';

interface ArticulationRatingScaleProps {
  selectedRating?: number;
  onRatingChange: (rating: number | undefined) => void;
  disabled?: boolean;
}

export function ArticulationRatingScale({
  selectedRating,
  onRatingChange,
  disabled = false,
}: ArticulationRatingScaleProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (value: number) => {
    setExpandedItems(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleCheckboxChange = (value: number, checked: boolean) => {
    if (disabled) return;
    onRatingChange(checked ? value : undefined);
  };

  return (
    <div className="space-y-2">
      {RATING_SCALE.map((level) => {
        const isExpanded = expandedItems.includes(level.value);
        const isSelected = selectedRating === level.value;

        return (
          <Collapsible
            key={level.value}
            open={isExpanded}
            onOpenChange={() => toggleExpand(level.value)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${level.value}`}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(level.value, checked === true)
                }
                disabled={disabled}
              />
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 text-left text-sm cursor-pointer',
                    disabled && 'opacity-60 cursor-not-allowed',
                    isSelected ? 'text-primary font-medium' : 'text-foreground'
                  )}
                  disabled={disabled}
                >
                  <span>{level.value}️⃣</span>
                  <span>{level.title}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="ml-6 mt-1 mb-2 pl-2 border-l-2 border-muted">
                <p className="text-sm text-muted-foreground mb-1">
                  {level.description}
                </p>
                <ul className="space-y-0.5">
                  {level.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground pl-2">
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
