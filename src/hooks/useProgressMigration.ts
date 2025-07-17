import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedProgress } from "./useEnhancedProgress";

export const useProgressMigration = () => {
  const { selectedChildIndex, profile } = useAuth();
  const { recordExerciseCompletion } = useEnhancedProgress();

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const migrateExistingProgress = () => {
    if (!selectedChild) return;

    // Check if migration already happened
    const migrationKey = `migration-completed-${selectedChild.id}`;
    if (localStorage.getItem(migrationKey)) {
      return; // Already migrated
    }

    // Get local storage data
    const saved = localStorage.getItem("vaje-motorike-govoril-progress");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const { completedCards, completionCount } = parsed;

      // Migrate completed cards as individual completions
      const totalCompletions = completedCards.length + (completionCount * 27);
      
      if (totalCompletions > 0) {
        console.log(`Migrating ${totalCompletions} exercise completions for ${selectedChild.name}`);

        // Record each completion in the database
        for (let i = 0; i < totalCompletions; i++) {
          recordExerciseCompletion('vaje_motorike_govoril');
        }

        // Mark migration as completed
        localStorage.setItem(migrationKey, 'true');
        console.log("Migration completed");
      }
    } catch (error) {
      console.error("Failed to migrate progress:", error);
    }
  };

  return {
    migrateExistingProgress,
    selectedChild
  };
};