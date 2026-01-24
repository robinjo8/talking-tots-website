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
    <div className="space-y-1 pt-3 border-t">
      <span className="text-sm font-medium text-foreground">Ocena artikulacije</span>
      <div className="space-y-1">
        {RATING_SCALE.map((level) => {
          const isExpanded = expandedItems.includes(level.value);
          const isSelected = selectedRating === level.value;

          return (
            <Collapsible
              key={level.value}
              open={isExpanded}
              onOpenChange={() => toggleExpand(level.value)}
            >
              <div
                className={cn(
                  'flex items-center gap-2 p-2 rounded-md border transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:bg-muted/50',
                  disabled && 'opacity-60 cursor-not-allowed'
                )}
              >
                <Checkbox
                  id={`rating-${level.value}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(level.value, checked === true)
                  }
                  disabled={disabled}
                  className="shrink-0"
                />
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-between text-left"
                    disabled={disabled}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{level.value}️⃣</span>
                      <span className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-primary' : 'text-foreground'
                      )}>
                        {level.title}
                      </span>
                    </div>
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
                <div className="ml-8 mt-1 mb-2 p-2 bg-muted/20 rounded-md border-l-2 border-primary/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    ☐ {level.description}
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
    </div>
  );
}
