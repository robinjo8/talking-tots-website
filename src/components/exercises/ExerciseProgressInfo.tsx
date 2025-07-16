import { Trophy, RotateCcw } from "lucide-react";
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
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          Napredek vaj
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion count display */}
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Opravljenih ciklov
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {completionCount}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Kolikokrat ste opravili vse vaje (1-27)
          </p>
        </div>

        {/* Current progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-foreground">
                Trenutna vaja: {currentCard}
              </p>
              <p className="text-xs text-muted-foreground">
                Opravljenih: {completedCount}/{totalCards}
              </p>
            </div>
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