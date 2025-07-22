
import { useAuth } from "@/contexts/AuthContext";

interface DifficultyConfig {
  pieceCount: number;
  gridSize: { rows: number; cols: number };
  complexity: 'simple' | 'moderate' | 'complex' | 'challenging';
  timeLimit?: number; // in minutes
}

export const useAdaptiveDifficulty = () => {
  const { profile, selectedChildIndex } = useAuth();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const getDifficultyConfig = (): DifficultyConfig => {
    const age = selectedChild?.age || 5;
    
    if (age >= 3 && age <= 4) {
      return {
        pieceCount: 6,
        gridSize: { rows: 2, cols: 3 },
        complexity: 'simple',
        timeLimit: 15
      };
    } else if (age >= 5 && age <= 6) {
      return {
        pieceCount: 12,
        gridSize: { rows: 3, cols: 4 },
        complexity: 'moderate',
        timeLimit: 20
      };
    } else if (age >= 7 && age <= 8) {
      return {
        pieceCount: 24,
        gridSize: { rows: 4, cols: 6 },
        complexity: 'complex',
        timeLimit: 25
      };
    } else {
      return {
        pieceCount: 35,
        gridSize: { rows: 5, cols: 7 },
        complexity: 'challenging',
        timeLimit: 30
      };
    }
  };

  return {
    difficultyConfig: getDifficultyConfig(),
    childAge: selectedChild?.age || 5,
    childName: selectedChild?.name || 'Otrok'
  };
};
