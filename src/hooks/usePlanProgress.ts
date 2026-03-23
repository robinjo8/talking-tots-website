import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityCompletion {
  id: string;
  plan_id: string;
  child_id: string;
  day_date: string;
  activity_index: number;
  play_number: number;
  set_number: number | null;
}

interface StarsByDate {
  day: string;
  stars: number;
}

export interface SetTracking {
  id: string;
  plan_id: string;
  child_id: string;
  set_number: number;
  started_at: string;
  completed_at: string | null;
  expired_at: string | null;
  total_stars: number;
  status: "active" | "completed" | "expired";
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

export function useSetTracking(planId: string | undefined, childId: string | undefined) {
  return useQuery({
    queryKey: ["set-tracking", planId, childId],
    queryFn: async () => {
      if (!planId || !childId) return [];

      const { data, error } = await supabase
        .from("plan_set_tracking")
        .select("*")
        .eq("plan_id", planId)
        .eq("child_id", childId)
        .order("set_number", { ascending: true });

      if (error) {
        console.error("Error fetching set tracking:", error);
        throw error;
      }

      return (data || []) as unknown as SetTracking[];
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
  activityIndex: number,
  setNumber?: number
): Promise<number> {
  let query = supabase
    .from("plan_activity_completions")
    .select("play_number")
    .eq("plan_id", planId)
    .eq("child_id", childId)
    .eq("day_date", dayDate)
    .eq("activity_index", activityIndex)
    .order("play_number", { ascending: false })
    .limit(1);

  if (setNumber !== undefined) {
    query = query.eq("set_number", setNumber);
  }

  const { data, error } = await query;

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
      setNumber,
    }: {
      planId: string;
      childId: string;
      dayDate: string;
      activityIndex: number;
      setNumber?: number;
    }) => {
      const currentCount = await getActivityPlayCount(planId, childId, dayDate, activityIndex, setNumber);
      const nextPlayNumber = currentCount + 1;

      const { data, error } = await supabase
        .from("plan_activity_completions")
        .insert({
          plan_id: planId,
          child_id: childId,
          day_date: dayDate,
          activity_index: activityIndex,
          play_number: nextPlayNumber,
          set_number: setNumber ?? null,
        } as any)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") return null;
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-completions", variables.planId, variables.childId] });
      queryClient.invalidateQueries({ queryKey: ["stars-by-date", variables.childId] });
      queryClient.invalidateQueries({ queryKey: ["set-tracking", variables.planId, variables.childId] });
    },
  });
}

/**
 * Start a new set - creates a tracking entry.
 */
export async function startSet(
  planId: string,
  childId: string,
  setNumber: number
): Promise<SetTracking | null> {
  // Check if an expired entry already exists for this set
  const { data: existing } = await supabase
    .from("plan_set_tracking")
    .select("*")
    .eq("plan_id", planId)
    .eq("child_id", childId)
    .eq("set_number", setNumber)
    .single();

  if (existing) {
    if ((existing as any).status === "expired") {
      // Reset expired set to active
      const { data: updated, error: updateError } = await supabase
        .from("plan_set_tracking")
        .update({
          status: "active",
          started_at: new Date().toISOString(),
          expired_at: null,
          total_stars: 0,
        } as any)
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error restarting expired set:", updateError);
        return null;
      }
      return updated as unknown as SetTracking;
    }
    // Already active or completed
    return existing as unknown as SetTracking;
  }

  // Create new tracking entry
  const { data, error } = await supabase
    .from("plan_set_tracking")
    .insert({
      plan_id: planId,
      child_id: childId,
      set_number: setNumber,
      status: "active",
    } as any)
    .select()
    .single();

  if (error) {
    console.error("Error starting set:", error);
    return null;
  }

  return data as unknown as SetTracking;
}

/**
 * Complete a set.
 */
export async function completeSet(
  planId: string,
  childId: string,
  setNumber: number,
  totalStars: number
): Promise<void> {
  const { error } = await supabase
    .from("plan_set_tracking")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      total_stars: totalStars,
    } as any)
    .eq("plan_id", planId)
    .eq("child_id", childId)
    .eq("set_number", setNumber);

  if (error) {
    console.error("Error completing set:", error);
  }
}

/**
 * Expire an active set that has been open for 24+ hours.
 */
export async function expireSet(
  planId: string,
  childId: string,
  setNumber: number,
  totalStars: number
): Promise<void> {
  const { error } = await supabase
    .from("plan_set_tracking")
    .update({
      status: "expired",
      expired_at: new Date().toISOString(),
      total_stars: totalStars,
    } as any)
    .eq("plan_id", planId)
    .eq("child_id", childId)
    .eq("set_number", setNumber)
    .eq("status", "active");

  if (error) {
    console.error("Error expiring set:", error);
  }
}

/**
 * Get the current date string in Ljubljana timezone.
 */
export function getTodayDateStr(): string {
  const now = new Date();
  // Use Ljubljana timezone offset approximation
  const ljTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Ljubljana" }));
  return `${ljTime.getFullYear()}-${String(ljTime.getMonth() + 1).padStart(2, "0")}-${String(ljTime.getDate()).padStart(2, "0")}`;
}

/**
 * Check if a set has expired (24 hours since started).
 */
export function isSetExpired(startedAt: string): boolean {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  return now - startTime > 24 * 60 * 60 * 1000;
}

/**
 * Check if any set was completed or expired today (to enforce 1 set/day limit).
 */
export function hasCompletedSetToday(trackingEntries: SetTracking[]): boolean {
  const todayStr = getTodayDateStr();
  return trackingEntries.some(entry => {
    if (entry.status !== "completed") return false;
    const dateStr = entry.completed_at || entry.started_at;
    return dateStr.startsWith(todayStr);
  });
}

/**
 * Build a map of completion counts per set per activity.
 * Returns Map<setNumber, Map<activityIndex, completionCount>>
 */
export function buildCompletionCountsBySet(
  completions: ActivityCompletion[]
): Map<number, Map<number, number>> {
  const map = new Map<number, Map<number, number>>();
  for (const c of completions) {
    const setNum = c.set_number ?? 0;
    if (!map.has(setNum)) map.set(setNum, new Map());
    const setMap = map.get(setNum)!;
    const current = setMap.get(c.activity_index) || 0;
    setMap.set(c.activity_index, current + 1);
  }
  return map;
}

// Legacy compatibility
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
