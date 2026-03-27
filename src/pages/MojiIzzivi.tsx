import { useEffect, useMemo, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyPlan, type PlanSet } from "@/hooks/useMonthlyPlan";
import {
  usePlanCompletions,
  useSetTracking,
  useCompleteActivity,
  checkNewProgress,
  getActivityPlayCount,
  buildCompletionCountsBySet,
  startSet,
  completeSet,
  expireSet,
  isSetExpired,
  getNextSetNumber,
  getTodayDateStr,
  type SetTracking,
} from "@/hooks/usePlanProgress";
import { PlanSetCard } from "@/components/plan/PlanSetCard";
import { SetUnboxAnimation } from "@/components/plan/SetUnboxAnimation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Calendar, History, ClipboardCheck, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PLAN_ACTIVITY_STORAGE_KEY = "plan-activity-tracking";

interface StoredActivityTracking {
  planId: string;
  setNumber: number;
  activityIndex: number;
  activityType: string;
  leftAt: string;
}

export default function MojiIzzivi() {
  const { selectedChild } = useAuth();
  const { data: plan, isLoading } = useMonthlyPlan(selectedChild?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isGenerating = plan?.status === "generating";
  const isActive = plan?.status === "active";
  const planData = plan?.plan_data;

  const isSetBased = !!(planData?.sets && planData.sets.length > 0);
  const totalSets = planData?.totalSets || 30;
  const setOffset = planData?.setOffset || 0;

  const { data: completions = [] } = usePlanCompletions(plan?.id, selectedChild?.id);
  const { data: trackingEntries = [], refetch: refetchTracking } = useSetTracking(plan?.id, selectedChild?.id);
  const completeActivity = useCompleteActivity();

  const completionCountsBySet = useMemo(() => {
    return buildCompletionCountsBySet(completions);
  }, [completions]);

  // Determine current state
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTracking = useMemo(() => {
    return trackingEntries.find(e => e.status === "active") || null;
  }, [trackingEntries]);

  const completedSetsCount = useMemo(() => {
    return trackingEntries.filter(e => e.status === "completed" || e.status === "expired").length;
  }, [trackingEntries]);

  const allSetsCompleted = completedSetsCount >= totalSets;

  // Find the next set number to work on (linear: always max + 1)
  const nextSetNumber = useMemo(() => {
    if (!isSetBased) return null;
    return getNextSetNumber(trackingEntries, totalSets);
  }, [trackingEntries, totalSets, isSetBased]);

  // Get the current set data
  const currentSetData = useMemo((): PlanSet | null => {
    if (!isSetBased || !planData?.sets) return null;
    const setNum = activeTracking?.set_number || nextSetNumber;
    if (!setNum) return null;
    return planData.sets.find(s => s.setNumber === setNum) || null;
  }, [isSetBased, planData, activeTracking, nextSetNumber]);

  // Handle expired set detection and auto-start
  useEffect(() => {
    if (!plan?.id || !selectedChild?.id || !isSetBased || isProcessing) return;

    const processSetState = async () => {
      if (activeTracking && isSetExpired(activeTracking.started_at)) {
        setIsProcessing(true);
        // Calculate stars earned for this set
        const setCompletions = completionCountsBySet.get(activeTracking.set_number) || new Map();
        let stars = 0;
        const setData = planData?.sets?.find(s => s.setNumber === activeTracking.set_number);
        if (setData) {
          setData.activities.forEach((act, idx) => {
            const plays = setCompletions.get(idx) || 0;
            const required = act.type === "motorika" ? 1 : 2;
            stars += Math.min(plays, required) * (act.type === "motorika" ? 2 : 1);
          });
        }
        await expireSet(plan.id, selectedChild.id, activeTracking.set_number, stars);
        await refetchTracking();
        setIsProcessing(false);
      }
    };

    processSetState();
  }, [activeTracking, plan?.id, selectedChild?.id, isSetBased]);

  // Calculate time remaining for active set
  const timeRemaining = useMemo(() => {
    if (!activeTracking) return undefined;
    const startTime = new Date(activeTracking.started_at).getTime();
    const endTime = startTime + 24 * 60 * 60 * 1000;
    const remaining = endTime - Date.now();
    if (remaining <= 0) return undefined;
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  }, [activeTracking]);

  // Stars for current set
  const currentSetStars = useMemo(() => {
    if (!currentSetData || !activeTracking) return 0;
    const setCompletions = completionCountsBySet.get(activeTracking.set_number) || new Map();
    let stars = 0;
    currentSetData.activities.forEach((act, idx) => {
      const plays = setCompletions.get(idx) || 0;
      const required = act.type === "motorika" ? 1 : 2;
      stars += Math.min(plays, required) * (act.type === "motorika" ? 2 : 1);
    });
    return stars;
  }, [currentSetData, activeTracking, completionCountsBySet]);

  // Check if current set is fully completed (10 stars)
  useEffect(() => {
    if (!activeTracking || !plan?.id || !selectedChild?.id || currentSetStars < 10) return;

    const doComplete = async () => {
      await completeSet(plan.id, selectedChild.id, activeTracking.set_number, currentSetStars);
      await refetchTracking();
      queryClient.invalidateQueries({ queryKey: ["set-tracking", plan.id, selectedChild.id] });
    };
    doComplete();
  }, [currentSetStars, activeTracking, plan?.id, selectedChild?.id]);

  // Handle starting a new set
  const handleStartSet = useCallback(async () => {
    if (!plan?.id || !selectedChild?.id || !nextSetNumber) return;
    setIsProcessing(true);
    await startSet(plan.id, selectedChild.id, nextSetNumber);
    await refetchTracking();
    setIsProcessing(false);

    // Trigger plan renewal when starting the last set
    if (nextSetNumber === totalSets && plan.report_id) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          supabase.functions.invoke("generate-monthly-plan", {
            body: { reportId: plan.report_id, mode: "renewal" },
          }).catch(err => console.error("Error pre-generating renewal plan:", err));
        }
      } catch (err) {
        console.error("Error triggering renewal:", err);
      }
    }
  }, [plan?.id, selectedChild?.id, nextSetNumber, totalSets, plan?.report_id]);

  // Check for returning from a game
  useEffect(() => {
    const stored = localStorage.getItem(PLAN_ACTIVITY_STORAGE_KEY);
    if (stored && plan?.id && selectedChild?.id) {
      localStorage.removeItem(PLAN_ACTIVITY_STORAGE_KEY);
      
      try {
        const tracking: StoredActivityTracking = JSON.parse(stored);
        if (tracking.planId !== plan.id) return;

        const todayStr = getTodayDateStr();

        const processCompletions = async () => {
          const { count } = await checkNewProgress(selectedChild!.id, tracking.leftAt);
          if (count <= 0) return;

          const existingCount = await getActivityPlayCount(
            tracking.planId,
            selectedChild!.id,
            todayStr,
            tracking.activityIndex,
            tracking.setNumber
          );

          const requiredPlays = tracking.activityType === "motorika" ? 1 : 2;
          const maxNewPlays = Math.min(count, requiredPlays - existingCount);

          for (let i = 0; i < maxNewPlays; i++) {
            await completeActivity.mutateAsync({
              planId: tracking.planId,
              childId: selectedChild!.id,
              dayDate: todayStr,
              activityIndex: tracking.activityIndex,
              setNumber: tracking.setNumber,
            });
          }
        };

        processCompletions().catch(console.error);
      } catch (e) {
        console.error("Failed to parse activity tracking:", e);
      }
    }
  }, [plan?.id, selectedChild?.id]);

  const handleActivityPlay = useCallback(
    (activityIndex: number, activityType: string, path: string) => {
      if (plan?.id && activeTracking) {
        const tracking: StoredActivityTracking = {
          planId: plan.id,
          setNumber: activeTracking.set_number,
          activityIndex,
          activityType,
          leftAt: new Date().toISOString(),
        };
        localStorage.setItem(PLAN_ACTIVITY_STORAGE_KEY, JSON.stringify(tracking));
      }
      navigate(path);
    },
    [plan?.id, activeTracking, navigate]
  );

  // Auto-renew plan when all 30 sets are completed
  useEffect(() => {
    if (!allSetsCompleted || !plan?.report_id || !plan?.id) return;

    const renewPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        await supabase.functions.invoke("generate-monthly-plan", {
          body: { reportId: plan.report_id, mode: "renewal" },
        });

        queryClient.invalidateQueries({ queryKey: ["monthly-plan", selectedChild?.id] });
      } catch (err) {
        console.error("Error auto-renewing plan:", err);
      }
    };

    renewPlan();
  }, [allSetsCompleted, plan?.report_id]);

  // Progress percentage
  const progressPercent = Math.round(((completedSetsCount + setOffset) / (totalSets + setOffset)) * 100);

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
        ) : isActive && planData && isSetBased ? (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20"
            >
              <h1 className="text-2xl font-bold text-center mb-2">Moj osebni načrt</h1>
              {planData.summary && (
                <p className="text-muted-foreground text-sm mt-1 text-justify">{planData.summary}</p>
              )}
              
              {/* Progress bar */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Napredek</span>
                  <span className="font-semibold">{completedSetsCount + setOffset}/{totalSets + setOffset} sklopov</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {trackingEntries.length > 0 && (
                <div className="flex justify-center mt-3">
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <Link to="/moji-izzivi/arhiv">
                      <History className="h-4 w-4" />
                      <span>Zgodovina</span>
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Current set or state */}
            {allSetsCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <PartyPopper className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-2">Čestitke! Vseh {totalSets + setOffset} sklopov je opravljenih!</h2>
                <p className="text-muted-foreground">Nov načrt se pripravlja...</p>
                <Loader2 className="h-6 w-6 text-primary animate-spin mt-4" />
              </motion.div>
            ) : activeTracking && currentSetData ? (
              <PlanSetCard
                setNumber={activeTracking.set_number + setOffset}
                totalSets={totalSets + setOffset}
                activities={currentSetData.activities}
                totalStars={currentSetStars}
                completionCounts={completionCountsBySet.get(activeTracking.set_number) || new Map()}
                isActive={true}
                isCompleted={false}
                isExpired={false}
                isLocked={false}
                timeRemaining={timeRemaining}
                childAvatarUrl={selectedChild?.avatarUrl}
                onActivityPlay={handleActivityPlay}
              />
            ) : nextSetNumber && currentSetData ? (
              <SetUnboxAnimation
                setNumber={nextSetNumber + setOffset}
                onComplete={handleStartSet}
                isProcessing={isProcessing}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Ni več sklopov na voljo.</p>
              </div>
            )}
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
      <Button asChild className="mt-6 gap-2">
        <Link to="/artikulacijski-test">
          <ClipboardCheck className="h-4 w-4" />
          Preverjanje izgovorjave
        </Link>
      </Button>
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
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}
