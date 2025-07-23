import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { MotivationalContainer } from "./progress/MotivationalContainer";
import { EnhancedProgressDisplay } from "./progress/EnhancedProgressDisplay";

export function ProgressSection() {
  const { progressData, isLoading, selectedChild } = useEnhancedProgress();

  if (isLoading) {
    return (
      <Card className="mb-8 animate-pulse">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Nalagam napredek...</div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedChild) {
    return (
      <Card className="mb-8 border-2 border-dashed border-muted">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Izberi otroka za ogled napredka</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <>
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Začni z vajami za ogled napredka!</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <EnhancedProgressDisplay progressData={progressData} />
    </>
  );
}