import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressTrackerProps {
  currentCard: number;
  totalCards: number;
  completedCount: number;
  onReset: () => void;
}

export const ProgressTracker = ({ 
  currentCard, 
  totalCards, 
  completedCount, 
  onReset 
}: ProgressTrackerProps) => {
  const progressPercentage = (completedCount / totalCards) * 100;

  return (
    <div className="bg-card border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Napredek vaj
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Ponastavi
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Trenutna vaja: {currentCard}</span>
            <span>Opravljenih: {completedCount}/{totalCards}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {completedCount === totalCards && (
          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
              🎉 Čestitke! Opravili ste vse vaje motorike govoril!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};