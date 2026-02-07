import { useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyPlan } from "@/hooks/useMonthlyPlan";
import {
  usePlanCompletions,
  useStarsByDate,
  useCompleteActivity,
  checkNewProgress,
  buildCompletionCountsByDay,
} from "@/hooks/usePlanProgress";
import { PlanDayCard } from "@/components/plan/PlanDayCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PLAN_ACTIVITY_STORAGE_KEY = "plan-activity-tracking";

interface StoredActivityTracking {
  planId: string;
  dayDate: string;
  activityIndex: number;
  activityType: string; // "motorika" | "igra"
  leftAt: string; // ISO timestamp
}

export default function MojiIzzivi() {
  const { selectedChild } = useAuth();
  const { data: plan, isLoading } = useMonthlyPlan(selectedChild?.id);
  const navigate = useNavigate();
  const todayRef = useRef<HTMLDivElement>(null);

  const isGenerating = plan?.status === "generating";
  const isActive = plan?.status === "active";
  const planData = plan?.plan_data;

  // Calculate date range for stars query from start_date/end_date
  const dateRange = useMemo(() => {
    if (!plan) return { start: "", end: "" };
    // Use new start_date/end_date fields, fallback to first/last day in plan_data
    const start = plan.start_date || plan.plan_data?.days?.[0]?.date || "";
    const end = plan.end_date || plan.plan_data?.days?.[plan.plan_data?.days?.length - 1]?.date || "";
    return { start, end };
  }, [plan]);

  const { data: completions = [] } = usePlanCompletions(plan?.id, selectedChild?.id);
  const { data: starsByDate = [] } = useStarsByDate(
    selectedChild?.id,
    dateRange.start,
    dateRange.end
  );
  const completeActivity = useCompleteActivity();

  // Build lookup maps - now with counts instead of sets
  const completionCountsByDay = useMemo(() => {
    return buildCompletionCountsByDay(completions);
  }, [completions]);

  const starsMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of starsByDate) {
      map.set(s.day, Number(s.stars));
    }
    return map;
  }, [starsByDate]);

  // Check for returning from a game - verify actual play before marking complete
  useEffect(() => {
    const stored = localStorage.getItem(PLAN_ACTIVITY_STORAGE_KEY);
    if (stored && plan?.id && selectedChild?.id) {
      localStorage.removeItem(PLAN_ACTIVITY_STORAGE_KEY);
      
      try {
        const tracking: StoredActivityTracking = JSON.parse(stored);
        if (tracking.planId !== plan.id) return;

        // Check if the child actually played the game (new progress entries after leftAt)
        checkNewProgress(selectedChild.id, tracking.leftAt).then(({ count }) => {
          if (count > 0) {
            // Child actually played - record one completion
            completeActivity.mutate({
              planId: tracking.planId,
              childId: selectedChild.id,
              dayDate: tracking.dayDate,
              activityIndex: tracking.activityIndex,
            });
          }
        });
      } catch (e) {
        console.error("Failed to parse activity tracking:", e);
      }
    }
  }, [plan?.id, selectedChild?.id]);

  // Scroll to today on mount
  useEffect(() => {
    if (isActive && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isActive, planData]);

  const handleActivityPlay = useCallback(
    (dayDate: string, activityIndex: number, activityType: string, path: string) => {
      if (plan?.id) {
        const tracking: StoredActivityTracking = {
          planId: plan.id,
          dayDate,
          activityIndex,
          activityType,
          leftAt: new Date().toISOString(),
        };
        localStorage.setItem(PLAN_ACTIVITY_STORAGE_KEY, JSON.stringify(tracking));
      }
      navigate(path);
    },
    [plan?.id, navigate]
  );

  // Get today's date string
  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  // Get days from plan (new format: flat days, legacy: weeks)
  const days = useMemo(() => {
    if (!planData) return [];
    if (planData.days) return planData.days;
    // Legacy format conversion with actual dates
    if (planData.weeks && plan) {
      let dayCounter = 0;
      return planData.weeks.flatMap((week) =>
        week.days.map((day) => {
          dayCounter++;
          const actualDate = `${plan.year}-${String(plan.month).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
          const dateObj = new Date(plan.year, plan.month - 1, dayCounter);
          const dayNames = ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"];
          return {
            ...day,
            date: actualDate,
            dayName: day.dayName || dayNames[dateObj.getDay()],
          };
        })
      );
    }
    return [];
  }, [planData, plan]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {isLoading ? (
          <PlanSkeleton />
        ) : isGenerating ? (
          <GeneratingState />
        ) : isActive && planData && days.length > 0 ? (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Moj osebni načrt</h1>
              </div>
              {planData.summary && (
                <p className="text-muted-foreground text-sm mt-1">{planData.summary}</p>
              )}
            </motion.div>

            {/* Day cards */}
            <div className="space-y-3">
              {days.map((day) => {
                const isToday = day.date === todayStr;
                const isPast = day.date < todayStr;
                const dayCompletionCounts = completionCountsByDay.get(day.date) || new Map<number, number>();
                const dayStars = starsMap.get(day.date) || 0;

                return (
                  <div key={day.date} ref={isToday ? todayRef : undefined}>
                    <PlanDayCard
                      date={day.date}
                      dayName={day.dayName}
                      activities={day.activities}
                      starsForDay={dayStars}
                      completionCounts={dayCompletionCounts}
                      isToday={isToday}
                      isPast={isPast}
                      planId={plan!.id}
                      childId={selectedChild!.id}
                      childAvatarUrl={selectedChild?.avatarUrl}
                      onActivityPlay={(activityIndex, activityType, path) =>
                        handleActivityPlay(day.date, activityIndex, activityType, path)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <Calendar className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Moj osebni načrt</h2>
      <p className="text-muted-foreground max-w-md">
        Tvoj osebni načrt vaj bo na voljo po prvem preverjanju izgovorjave pri logopedu.
        Ko logopedinja zaključi pregled, se bo načrt samodejno ustvaril.
      </p>
    </div>
  );
}

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Načrt se pripravlja...</h2>
      <p className="text-muted-foreground max-w-md">
        Tvoj osebni načrt vaj se pripravlja. Počakaj trenutek.
      </p>
    </div>
  );
}

function PlanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
