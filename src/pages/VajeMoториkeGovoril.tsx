import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SequentialExerciseGrid } from "@/components/exercises/SequentialExerciseGrid";
import { ExerciseProgressInfo } from "@/components/exercises/ExerciseProgressInfo";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { progress, resetProgress, isCardCompleted } = useExerciseProgress();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vaje motorike govoril
          </h1>
        </div>

        <ExerciseProgressInfo
          completionCount={progress.completionCount}
          currentCard={progress.currentUnlockedCard}
          totalCards={27}
          completedCount={progress.completedCards.length}
          onReset={resetProgress}
        />

        <SequentialExerciseGrid />
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;