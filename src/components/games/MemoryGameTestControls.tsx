import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { toast } from "sonner";

interface MemoryGameTestControlsProps {
  gameSubtype: string;
  completionCount?: number;
}

export function MemoryGameTestControls({ gameSubtype, completionCount = 0 }: MemoryGameTestControlsProps) {
  const [testValue, setTestValue] = useState(9);
  const { recordGameCompletion } = useEnhancedProgress();

  const handleTestSet = () => {
    // Record multiple game completions to test the reward system
    for (let i = 0; i < testValue; i++) {
      setTimeout(() => {
        recordGameCompletion('memory', gameSubtype);
      }, i * 100); // Small delay between each record
    }
    
    toast.success(`Dodanih ${testValue} dokončanih iger za glas ${gameSubtype}!`);
  };

  return (
    <Card className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">Test nagradni sistem:</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={testValue}
              onChange={(e) => setTestValue(Number(e.target.value))}
              className="w-16 h-8 text-xs"
              min="1"
              max="50"
            />
            <Button
              onClick={handleTestSet}
              variant="outline"
              size="sm"
              className="text-xs h-8"
            >
              Dodaj {testValue} iger
            </Button>
          </div>
          {completionCount > 0 && (
            <span className="text-sm text-green-600 font-medium">
              Trenutno: {completionCount} dokončanih
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}