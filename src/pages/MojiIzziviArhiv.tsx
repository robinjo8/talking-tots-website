import { useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyPlan } from "@/hooks/useMonthlyPlan";
import {
  usePlanCompletions,
  useStarsByDate,
  buildCompletionCountsByDay,
} from "@/hooks/usePlanProgress";
import { PlanDayCard } from "@/components/plan/PlanDayCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function MojiIzziviArhiv() {
  const { selectedChild } = useAuth();
  const { data: plan, isLoading } = useMonthlyPlan(selectedChild?.id);

  const planData = plan?.plan_data;

  const dateRange = useMemo(() => {
    if (!plan) return { start: "", end: "" };
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

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  // Get all days and filter to past only, newest first
  const pastDays = useMemo(() => {
    if (!planData?.days) return [];
    return planData.days
      .filter((d) => d.date < todayStr)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [planData, todayStr]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button variant="ghost" size="icon" asChild>
            <Link to="/moji-izzivi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pretekli dnevi</h1>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : pastDays.length > 0 ? (
          <div className="space-y-3">
            {pastDays.map((day) => {
              const dayCompletionCounts = completionCountsByDay.get(day.date) || new Map<number, number>();
              const dayStars = starsMap.get(day.date) || 0;

              return (
                <PlanDayCard
                  key={day.date}
                  date={day.date}
                  dayName={day.dayName}
                  activities={day.activities}
                  starsForDay={dayStars}
                  completionCounts={dayCompletionCounts}
                  isToday={false}
                  isPast={true}
                  planId={plan!.id}
                  childId={selectedChild!.id}
                  childAvatarUrl={selectedChild?.avatarUrl}
                  onActivityPlay={() => {}}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Še ni preteklih dni za prikaz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
