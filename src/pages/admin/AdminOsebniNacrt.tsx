import { useParams } from "react-router-dom";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Check, Clock, AlertTriangle } from "lucide-react";
import { useLogopedistChild } from "@/hooks/useLogopedistChildren";
import { useMonthlyPlan } from "@/hooks/useMonthlyPlan";
import { useSetTracking, type SetTracking } from "@/hooks/usePlanProgress";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOsebniNacrt() {
  const { childId } = useParams<{ childId: string }>();
  const { data: child } = useLogopedistChild(childId);
  const { data: plan, isLoading: planLoading } = useMonthlyPlan(childId);
  const { data: trackingEntries = [] } = useSetTracking(plan?.id, childId);

  const MAX_CYCLE_SETS = 90;
  const totalSets = MAX_CYCLE_SETS;
  const completedSets = trackingEntries.filter(e => e.status === "completed").length;
  const expiredSets = trackingEntries.filter(e => e.status === "expired").length;
  const progressPercent = Math.round((completedSets / totalSets) * 100);

  const isSetBased = !!(plan?.plan_data?.sets && plan.plan_data.sets.length > 0);

  return (
    <AdminGameWrapper 
      title="Moj osebni načrt"
      backPath={`/admin/children/${childId}/workspace`}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="rounded-2xl border-2 border-border">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center border border-border">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <h3 className="text-lg font-semibold mb-2 text-primary text-center">
              Osebni načrt {child ? `za ${child.name}` : ''}
            </h3>

            {planLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : plan && isSetBased ? (
              <div className="space-y-6 mt-4">
                {/* Progress overview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Napredek</span>
                    <span className="font-semibold">{completedSets}/{totalSets} sklopov</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 text-center">
                    <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-700 dark:text-green-400">{completedSets}</p>
                    <p className="text-xs text-muted-foreground">Opravljeni</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 text-center">
                    <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{expiredSets}</p>
                    <p className="text-xs text-muted-foreground">Potekli</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{totalSets - completedSets - expiredSets}</p>
                    <p className="text-xs text-muted-foreground">Preostali</p>
                  </div>
                </div>

                {/* Completed sets list */}
                {trackingEntries.filter(e => e.status !== "active").length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Zgodovina sklopov</h4>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {trackingEntries
                        .filter(e => e.status !== "active")
                        .sort((a, b) => (b.completed_at || b.expired_at || b.started_at).localeCompare(a.completed_at || a.expired_at || a.started_at))
                        .map(entry => {
                          const dateStr = entry.completed_at || entry.expired_at || entry.started_at;
                          const date = new Date(dateStr);
                          return (
                            <div key={entry.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/30 text-sm">
                              <div className="flex items-center gap-2">
                                {entry.status === "completed" ? (
                                  <Check className="h-3.5 w-3.5 text-green-600" />
                                ) : (
                                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                                )}
                                <span>Sklop {entry.set_number}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span>{entry.total_stars}⭐</span>
                                <span>{date.toLocaleDateString("sl-SI")}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Focus letters */}
                {plan.focus_letters && plan.focus_letters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Glasovi v fokusu</h4>
                    <div className="flex gap-2 flex-wrap">
                      {plan.focus_letters.map(letter => (
                        <span key={letter} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">Za tega otroka še ni ustvarjenega osebnega načrta.</p>
                <p className="text-xs mt-1">Načrt se ustvari ob potrditvi logopedskega poročila.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGameWrapper>
  );
}
