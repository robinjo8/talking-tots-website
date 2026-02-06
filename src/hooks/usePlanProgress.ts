import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityCompletion {
  id: string;
  plan_id: string;
  child_id: string;
  day_date: string;
  activity_index: number;
  completed_at: string;
}

interface StarsByDate {
  day: string;
  stars: number;
}

export function usePlanCompletions(planId: string | undefined, childId: string | undefined) {
  return useQuery({
    queryKey: ["plan-completions", planId, childId],
    queryFn: async () => {
      if (!planId || !childId) return [];

      const { data, error } = await supabase
        .from("plan_activity_completions")
        .select("*")
        .eq("plan_id", planId)
        .eq("child_id", childId);

      if (error) {
        console.error("Error fetching plan completions:", error);
        throw error;
      }

      return (data || []) as ActivityCompletion[];
    },
    enabled: !!planId && !!childId,
  });
}

export function useStarsByDate(childId: string | undefined, startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["stars-by-date", childId, startDate, endDate],
    queryFn: async () => {
      if (!childId) return [];

      const { data, error } = await supabase
        .rpc("get_child_stars_by_date", {
          child_uuid: childId,
          start_date: startDate,
          end_date: endDate,
        });

      if (error) {
        console.error("Error fetching stars by date:", error);
        throw error;
      }

      return (data || []) as StarsByDate[];
    },
    enabled: !!childId && !!startDate && !!endDate,
  });
}

export function useCompleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      childId,
      dayDate,
      activityIndex,
    }: {
      planId: string;
      childId: string;
      dayDate: string;
      activityIndex: number;
    }) => {
      const { data, error } = await supabase
        .from("plan_activity_completions")
        .insert({
          plan_id: planId,
          child_id: childId,
          day_date: dayDate,
          activity_index: activityIndex,
        })
        .select()
        .single();

      if (error) {
        // Ignore unique constraint violations (already completed)
        if (error.code === "23505") return null;
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-completions", variables.planId, variables.childId] });
    },
  });
}
