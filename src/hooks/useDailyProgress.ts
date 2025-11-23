import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useDailyProgress = () => {
  const { selectedChild } = useAuth();

  const { data: dailyActivities, isLoading, error } = useQuery({
    queryKey: ["dailyProgress", selectedChild?.id, new Date().toDateString()],
    queryFn: async (): Promise<number> => {
      if (!selectedChild?.id) return 0;

      const { data, error } = await supabase
        .rpc('get_child_daily_activities', { child_uuid: selectedChild.id });

      if (error) {
        console.error("Error fetching daily progress:", error);
        throw error;
      }
      
      return data || 0;
    },
    enabled: !!selectedChild?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    dailyActivities: dailyActivities || 0,
    isLoading,
    error,
    selectedChild
  };
};
