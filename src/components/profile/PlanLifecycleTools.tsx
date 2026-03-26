import { useState } from "react";
import { FlaskConical, Loader2, RotateCcw, Zap, Calendar, CreditCard, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isDevUser } from "@/lib/devAccess";

export function PlanLifecycleTools() {
  const { user, selectedChild } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [daysAgo, setDaysAgo] = useState("100");
  const [cooldownPreview, setCooldownPreview] = useState<any>(null);

  if (!isDevUser(user?.email)) return null;

  const invoke = async (action: string, extra: Record<string, any> = {}) => {
    if (!selectedChild?.id) {
      toast.error("Najprej izberite otroka.");
      return;
    }
    setLoading(action);
    try {
      const response = await supabase.functions.invoke("simulate-plan-lifecycle", {
        body: { childId: selectedChild.id, action, ...extra },
      });
      if (response.error) {
        console.error(`${action} error:`, response.error);
        toast.error(`Napaka pri ${action}: ${response.error.message}`);
      } else {
        if (action === "calculate_cooldown_preview") {
          setCooldownPreview(response.data);
          toast.success("Cooldown predogled izračunan.");
        } else {
          toast.success(`${action}: ${JSON.stringify(response.data)}`);
        }
      }
    } catch (err) {
      console.error(`${action} error:`, err);
      toast.error(`Napaka pri ${action}`);
    } finally {
      setLoading(null);
    }
  };

  const isLoading = (action: string) => loading === action;
  const BtnIcon = ({ action }: { action: string }) =>
    isLoading(action) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Lifecycle orodja
        </h2>
      </div>
      <div className="p-4 space-y-3">
        {/* Plan actions */}
        <p className="text-sm font-medium text-muted-foreground">Osebni načrt</p>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
          onClick={() => invoke("complete_all_sets")}
          disabled={!!loading}
        >
          <BtnIcon action="complete_all_sets" />
          {!isLoading("complete_all_sets") && <Zap className="h-4 w-4 mr-2 text-dragon-green" />}
          Zaključi vseh 30 sklopov
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
          onClick={() => invoke("simulate_age_transition")}
          disabled={!!loading}
        >
          <BtnIcon action="simulate_age_transition" />
          {!isLoading("simulate_age_transition") && <Calendar className="h-4 w-4 mr-2 text-dragon-green" />}
          Simuliraj starostni prehod
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => invoke("reset_plan")}
          disabled={!!loading}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <BtnIcon action="reset_plan" />
          {!isLoading("reset_plan") && <RotateCcw className="h-4 w-4 mr-2" />}
          Ponastavi osebni načrt
        </Button>

        {/* Test simulation */}
        <p className="text-sm font-medium text-muted-foreground mt-4">Simulacija zamude pri testu</p>
        <div className="flex gap-2">
          <Input
            type="number"
            value={daysAgo}
            onChange={(e) => setDaysAgo(e.target.value)}
            className="w-24"
            placeholder="Dni nazaj"
          />
          <Button
            variant="outline"
            className="flex-1 justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
            onClick={() => invoke("simulate_delayed_test", { daysAgo: parseInt(daysAgo) })}
            disabled={!!loading}
          >
            <BtnIcon action="simulate_delayed_test" />
            Simuliraj zamudo
          </Button>
        </div>

        {/* Subscription actions */}
        <p className="text-sm font-medium text-muted-foreground mt-4">Naročnina</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => invoke("simulate_subscription_change", { subAction: "extend" })}
            disabled={!!loading}
            className="text-xs hover:bg-dragon-green/10"
          >
            <CreditCard className="h-3 w-3 mr-1" />
            Podaljšaj
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => invoke("simulate_subscription_change", { subAction: "cancel" })}
            disabled={!!loading}
            className="text-xs hover:text-destructive"
          >
            Prekliči
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => invoke("simulate_subscription_change", { subAction: "expire" })}
            disabled={!!loading}
            className="text-xs hover:text-destructive"
          >
            Poteci
          </Button>
        </div>

        {/* Cooldown preview */}
        <p className="text-sm font-medium text-muted-foreground mt-4">Predogled</p>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
          onClick={() => invoke("calculate_cooldown_preview")}
          disabled={!!loading}
        >
          <BtnIcon action="calculate_cooldown_preview" />
          {!isLoading("calculate_cooldown_preview") && <Eye className="h-4 w-4 mr-2 text-dragon-green" />}
          Predogled cooldown datumov
        </Button>

        {cooldownPreview && (
          <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono space-y-1 max-h-60 overflow-auto">
            {cooldownPreview.tests?.map((t: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span>Test {i + 1}: {t.date}</span>
                <span className={t.status === 'opravljen' ? 'text-dragon-green' : 'text-muted-foreground'}>
                  {t.status} {t.cooldownDays ? `(${t.cooldownDays}d)` : ''}
                </span>
              </div>
            ))}
            {cooldownPreview.subscriptionEnd && (
              <div className="border-t pt-1 mt-1 text-muted-foreground">
                Potek naročnine: {cooldownPreview.subscriptionEnd}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
