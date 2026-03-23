import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Clock, XCircle, TrendingUp, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SetEntry {
  id: string;
  set_number: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  expired_at: string | null;
  total_stars: number;
}

interface ActivityEntry {
  activity_index: number;
  day_date: string;
  play_number: number;
  set_number: number | null;
}

interface ChildPlanArchiveProps {
  childId: string;
}

export function ChildPlanArchive({ childId }: ChildPlanArchiveProps) {
  // Fetch child's monthly plan
  const { data: plan } = useQuery({
    queryKey: ["admin-child-plan", childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("child_monthly_plans")
        .select("*")
        .eq("child_id", childId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!childId,
  });

  // Fetch set tracking
  const { data: setEntries = [] } = useQuery({
    queryKey: ["admin-set-tracking", plan?.id, childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plan_set_tracking")
        .select("*")
        .eq("plan_id", plan!.id)
        .eq("child_id", childId)
        .order("set_number", { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as SetEntry[];
    },
    enabled: !!plan?.id,
  });

  // Fetch activity completions
  const { data: activityEntries = [] } = useQuery({
    queryKey: ["admin-activity-completions", plan?.id, childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plan_activity_completions")
        .select("activity_index, day_date, play_number, set_number")
        .eq("plan_id", plan!.id)
        .eq("child_id", childId);

      if (error) throw error;
      return (data || []) as ActivityEntry[];
    },
    enabled: !!plan?.id,
  });

  if (!plan) {
    return (
      <p className="text-sm text-muted-foreground italic py-4">
        Otrok nima aktivnega osebnega načrta.
      </p>
    );
  }

  const planData = plan.plan_data as any;
  const totalSets = planData?.totalSets || 30;
  const completedSets = setEntries.filter(e => e.status === "completed");
  const expiredSets = setEntries.filter(e => e.status === "expired");
  const activeSets = setEntries.filter(e => e.status === "active");
  const totalStars = setEntries.reduce((sum, e) => sum + (e.total_stars || 0), 0);
  const avgStars = completedSets.length > 0
    ? (completedSets.reduce((s, e) => s + e.total_stars, 0) / completedSets.length).toFixed(1)
    : "0";

  const getSetActivities = (setNumber: number) => {
    return activityEntries.filter(a => a.set_number === setNumber);
  };

  const getSetPlanData = (setNumber: number) => {
    if (!planData?.sets) return null;
    return planData.sets.find((s: any) => s.setNumber === setNumber);
  };

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label="Opravljeni"
          value={`${completedSets.length}/${totalSets}`}
        />
        <StatCard
          icon={<XCircle className="h-4 w-4 text-orange-500" />}
          label="Potekli"
          value={String(expiredSets.length)}
        />
        <StatCard
          icon={<Star className="h-4 w-4 text-yellow-500" />}
          label="Skupno zvezdic"
          value={String(totalStars)}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          label="Povprečje ⭐"
          value={avgStars}
        />
      </div>

      {/* Focus letters */}
      {plan.focus_letters && plan.focus_letters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Glasovi:</span>
          {plan.focus_letters.map((letter: string) => (
            <Badge key={letter} variant="secondary">{letter}</Badge>
          ))}
        </div>
      )}

      {/* Set list */}
      {setEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-4">
          Otrok še ni začel nobenega sklopa.
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {setEntries.map((entry) => {
            const activities = getSetActivities(entry.set_number);
            const setPlanData = getSetPlanData(entry.set_number);
            const dateStr = entry.completed_at || entry.expired_at || entry.started_at;
            const date = new Date(dateStr);

            return (
              <AccordionItem key={entry.id} value={entry.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusIcon status={entry.status} />
                    <span className="font-medium">Sklop {entry.set_number}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(date, "d. MMM yyyy", { locale: sl })}
                    </span>
                    <Badge
                      variant={entry.status === "completed" ? "default" : entry.status === "expired" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {entry.total_stars} ⭐
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2 pt-2">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Začetek: {format(new Date(entry.started_at), "d. MMM yyyy HH:mm", { locale: sl })}</p>
                      {entry.completed_at && (
                        <p>Zaključeno: {format(new Date(entry.completed_at), "d. MMM yyyy HH:mm", { locale: sl })}</p>
                      )}
                      {entry.expired_at && (
                        <p className="text-orange-600">Poteklo: {format(new Date(entry.expired_at), "d. MMM yyyy HH:mm", { locale: sl })}</p>
                      )}
                    </div>

                    {setPlanData?.activities && (
                      <div className="space-y-1 pt-2">
                        <p className="text-xs font-medium text-muted-foreground">Aktivnosti:</p>
                        {setPlanData.activities.map((act: any, idx: number) => {
                          const plays = activities.filter(a => a.activity_index === idx).length;
                          const required = act.type === "motorika" ? 1 : 2;
                          const done = plays >= required;
                          return (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Gamepad2 className={`h-3.5 w-3.5 ${done ? "text-green-600" : "text-muted-foreground"}`} />
                              <span className={done ? "text-foreground" : "text-muted-foreground"}>
                                {act.label || act.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({plays}/{required})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "expired") return <XCircle className="h-4 w-4 text-orange-500" />;
  return <Clock className="h-4 w-4 text-primary" />;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
