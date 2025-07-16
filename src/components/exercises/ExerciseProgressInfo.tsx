import { RotateCcw, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExerciseProgressInfoProps {
  completionCount: number;
  currentCard: number;
  totalCards: number;
  completedCount: number;
  onReset: () => void;
  childName?: string;
}

export const ExerciseProgressInfo = ({
  completionCount,
  currentCard,
  totalCards,
  completedCount,
  onReset,
  childName
}: ExerciseProgressInfoProps) => {
  console.log("ExerciseProgressInfo render:", { completionCount, currentCard, totalCards, completedCount });

  return (
    <>
      {/* Green instruction box like on games pages */}
      <Card className="mb-6 bg-gradient-to-r from-sky-50 to-light-cloud border-dragon-green/30 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
            <MessageSquare className="h-5 w-5 text-dragon-green" />
            Vaje motorike govoril
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <img 
              src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
              alt="Zmajček Tomi" 
              className="w-full h-full object-contain animate-bounce-gentle"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">
              {childName || "Tian"}, poskušaj odpreti vse zmajčke in si zasluži nagrado!
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-dragon-green">
                  Opravljene vaje: {completionCount}
                </span>
              </div>
              {completedCount === 27 && (
                <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">
                    🎉 Pripravljeni ste za zaključek cikla!
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};