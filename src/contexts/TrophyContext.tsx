import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrophyDialog } from "@/components/exercises/TrophyDialog";

interface TrophyData {
  childName: string;
  totalStars: number;
  trophyNumber: number;
}

interface TrophyContextValue {
  checkForNewTrophy: () => Promise<void>;
}

const TrophyContext = createContext<TrophyContextValue | undefined>(undefined);

export function TrophyProvider({ children }: { children: ReactNode }) {
  const { selectedChild } = useAuth();
  const queryClient = useQueryClient();
  const [showTrophy, setShowTrophy] = useState(false);
  const [trophyData, setTrophyData] = useState<TrophyData | null>(null);

  const checkForNewTrophy = useCallback(async () => {
    if (!selectedChild?.id) return;

    try {
      // Invalidate and refetch the progress data
      await queryClient.invalidateQueries({ queryKey: ["enhancedProgress", selectedChild.id] });

      // Fetch fresh progress data directly
      const { data: activitySummary } = await supabase
        .rpc('get_child_activity_summary', { child_uuid: selectedChild.id });

      if (!activitySummary) return;

      // Calculate total stars
      const gameActivities = activitySummary.filter((a: any) => 
        a.activity_type === 'memory_game' || a.activity_type === 'puzzle'
      );
      const exerciseActivities = activitySummary.filter((a: any) => 
        a.activity_type === 'exercise'
      );

      const gamesTotalCompletions = gameActivities.reduce((sum: number, a: any) => sum + a.completion_count, 0);
      const exercisesTotalCompletions = exerciseActivities.reduce((sum: number, a: any) => sum + a.completion_count, 0);
      const totalStars = gamesTotalCompletions + exercisesTotalCompletions;
      
      // Calculate trophies (every 100 stars = 1 trophy)
      const totalDragons = Math.floor(totalStars / 10);
      const totalTrophies = Math.floor(totalDragons / 10);

      if (totalTrophies > 0) {
        // Check if this trophy has been claimed
        const storageKey = `trophy_claimed_${selectedChild.id}_${totalTrophies}`;
        const hasClaimed = localStorage.getItem(storageKey);

        if (!hasClaimed) {
          console.log("New trophy detected!", { totalStars, totalTrophies, childName: selectedChild.name });
          setTrophyData({
            childName: selectedChild.name,
            totalStars,
            trophyNumber: totalTrophies
          });
          setShowTrophy(true);
        }
      }
    } catch (error) {
      console.error("Error checking for trophy:", error);
    }
  }, [selectedChild, queryClient]);

  const handleClaimTrophy = useCallback(() => {
    if (!selectedChild?.id || !trophyData) return;
    
    // Mark this trophy as claimed
    const storageKey = `trophy_claimed_${selectedChild.id}_${trophyData.trophyNumber}`;
    localStorage.setItem(storageKey, 'true');
    
    setShowTrophy(false);
    setTrophyData(null);
  }, [selectedChild?.id, trophyData]);

  return (
    <TrophyContext.Provider value={{ checkForNewTrophy }}>
      {children}
      <TrophyDialog
        isOpen={showTrophy}
        onClose={handleClaimTrophy}
        onClaimTrophy={handleClaimTrophy}
        childName={trophyData?.childName}
        totalStars={trophyData?.totalStars}
        trophyNumber={trophyData?.trophyNumber}
      />
    </TrophyContext.Provider>
  );
}

export function useTrophyContext() {
  const context = useContext(TrophyContext);
  if (context === undefined) {
    throw new Error("useTrophyContext must be used within a TrophyProvider");
  }
  return context;
}
