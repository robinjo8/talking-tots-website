import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlanActivity {
  type: "motorika" | "igra";
  title: string;
  path: string;
  letter?: string;
  gameId?: string;
  // Legacy fields (kept for backward compatibility)
  description?: string;
  duration?: string;
}

export interface PlanDay {
  date: string;
  dayName: string;
  activities: PlanActivity[];
  // Legacy fields
  dayNumber?: number;
}

// Legacy types kept for backward compatibility
export interface PlanWeek {
  weekNumber: number;
  theme: string;
  days: PlanDay[];
}

export interface MonthlyPlanData {
  summary: string;
  targetLetters: string[];
  childAge: number;
  ageGroup: string;
  totalDays?: number;
  days?: PlanDay[];
  // Legacy
  weeks?: PlanWeek[];
}

export interface MonthlyPlan {
  id: string;
  child_id: string;
  report_id: string | null;
  plan_data: MonthlyPlanData;
  focus_letters: string[];
  month: number;
  year: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useMonthlyPlan(childId: string | undefined) {
  return useQuery({
    queryKey: ["monthly-plan", childId],
    queryFn: async () => {
      if (!childId) return null;

      const { data, error } = await supabase
        .from("child_monthly_plans")
        .select("*")
        .eq("child_id", childId)
        .in("status", ["active", "generating"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching monthly plan:", error);
        throw error;
      }

      return data as unknown as MonthlyPlan | null;
    },
    enabled: !!childId,
    refetchInterval: (query) => {
      const plan = query.state.data as MonthlyPlan | null | undefined;
      if (plan?.status === "generating") return 5000;
      return false;
    },
  });
}
