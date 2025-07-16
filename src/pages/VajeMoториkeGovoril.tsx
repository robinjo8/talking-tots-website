import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SequentialExerciseGrid } from "@/components/exercises/SequentialExerciseGrid";
import { ExerciseProgressInfo } from "@/components/exercises/ExerciseProgressInfo";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { useIsMobile } from "@/hooks/use-mobile";

const VajeMoториkeGovoril = () => {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const exerciseProgressHook = useExerciseProgress();
  const { progress, resetProgress, isCardCompleted } = exerciseProgressHook;
  const isMobile = useIsMobile();

  // Get selected child's name
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
  const childName = selectedChild?.name;

  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Enable fullscreen on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      requestFullscreen();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);

  return (
    <div className={`${effectiveFullscreen ? 'fixed inset-0 bg-background overflow-hidden' : 'min-h-screen bg-background'}`}>
      {!effectiveFullscreen && <Header />}
      
      {effectiveFullscreen ? (
        <div className="h-full flex flex-col p-2">
          <ExerciseProgressInfo
            completionCount={progress.completionCount}
            currentCard={progress.currentUnlockedCard}
            totalCards={27}
            completedCount={progress.completedCards.length}
            onReset={resetProgress}
            childName={childName}
          />

          <div className="flex-1 overflow-auto">
            <SequentialExerciseGrid exerciseProgressHook={exerciseProgressHook} />
          </div>
        </div>
      ) : (
        <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          <ExerciseProgressInfo
            completionCount={progress.completionCount}
            currentCard={progress.currentUnlockedCard}
            totalCards={27}
            completedCount={progress.completedCards.length}
            onReset={resetProgress}
            childName={childName}
          />

          <SequentialExerciseGrid exerciseProgressHook={exerciseProgressHook} />
        </div>
      )}
    </div>
  );
};

export default VajeMoториkeGovoril;