import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExerciseProgressInfoProps {
  completionCount: number;
  currentCard: number;
  totalCards: number;
  completedCount: number;
  onReset: () => void;
}

export const ExerciseProgressInfo = ({
  completionCount,
  currentCard,
  totalCards,
  completedCount,
  onReset
}: ExerciseProgressInfoProps) => {
  const progressPercentage = (completedCount / totalCards) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Opravljene vaje: {completionCount}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current progress */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Opravljenih: {completedCount}/{totalCards}
            </p>
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
            <p className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">
              🎉 Pripravljeni ste za zaključek cikla!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};