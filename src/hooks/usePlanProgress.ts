import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityCompletion {
  id: string;
  plan_id: string;
  child_id: string;
  day_date: string;
  activity_index: number;
  play_number: number;
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

/**
 * Check if new progress entries were created after a given timestamp.
 * Used to verify that a child actually played a game before marking it complete.
 */
export async function checkNewProgress(
  childId: string,
  afterTimestamp: string
): Promise<{ count: number; totalStars: number }> {
  const { data, error } = await supabase
    .from("progress")
    .select("stars_earned")
    .eq("child_id", childId)
    .gt("completed_at", afterTimestamp);

  if (error) {
    console.error("Error checking new progress:", error);
    return { count: 0, totalStars: 0 };
  }

  const count = data?.length || 0;
  const totalStars = data?.reduce((sum, r) => sum + (r.stars_earned || 0), 0) || 0;
  return { count, totalStars };
}

/**
 * Get the current play count for a specific activity.
 */
export async function getActivityPlayCount(
  planId: string,
  childId: string,
  dayDate: string,
  activityIndex: number
): Promise<number> {
  const { data, error } = await supabase
    .from("plan_activity_completions")
    .select("play_number")
    .eq("plan_id", planId)
    .eq("child_id", childId)
    .eq("day_date", dayDate)
    .eq("activity_index", activityIndex)
    .order("play_number", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return 0;
  return data[0].play_number;
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
      // Get current play count to determine next play_number
      const currentCount = await getActivityPlayCount(planId, childId, dayDate, activityIndex);
      const nextPlayNumber = currentCount + 1;

      const { data, error } = await supabase
        .from("plan_activity_completions")
        .insert({
          plan_id: planId,
          child_id: childId,
          day_date: dayDate,
          activity_index: activityIndex,
          play_number: nextPlayNumber,
        })
        .select()
        .single();

      if (error) {
        // Ignore unique constraint violations (already completed this play)
        if (error.code === "23505") return null;
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-completions", variables.planId, variables.childId] });
      queryClient.invalidateQueries({ queryKey: ["stars-by-date", variables.childId] });
    },
  });
}

/**
 * Build a map of completion counts per day per activity.
 * Returns Map<dayDate, Map<activityIndex, completionCount>>
 */
export function buildCompletionCountsByDay(
  completions: ActivityCompletion[]
): Map<string, Map<number, number>> {
  const map = new Map<string, Map<number, number>>();
  for (const c of completions) {
    if (!map.has(c.day_date)) map.set(c.day_date, new Map());
    const dayMap = map.get(c.day_date)!;
    const current = dayMap.get(c.activity_index) || 0;
    dayMap.set(c.activity_index, current + 1);
  }
  return map;
}
