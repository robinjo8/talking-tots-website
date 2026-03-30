import { useState } from "react";
import { FlaskConical, Loader2, RotateCcw, Zap, Calendar, CreditCard, Eye, ClipboardCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isDevUser } from "@/lib/devAccess";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";

export function PlanLifecycleTools() {
  const { user, selectedChild } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [daysAgo, setDaysAgo] = useState("50");
  const [cooldownPreview, setCooldownPreview] = useState<any>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
          // Invalidate all plan-related caches after any mutation
          queryClient.invalidateQueries({ queryKey: ["monthly-plan"] });
          queryClient.invalidateQueries({ queryKey: ["set-tracking"] });
          queryClient.invalidateQueries({ queryKey: ["plan-completions"] });
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

        {/* Full test simulation */}
        <p className="text-sm font-medium text-muted-foreground mt-4">Preverjanje izgovorjave</p>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
          onClick={() => invoke("simulate_full_test")}
          disabled={!!loading}
        >
          <BtnIcon action="simulate_full_test" />
          {!isLoading("simulate_full_test") && <FlaskConical className="h-4 w-4 mr-2 text-dragon-green" />}
          Simuliraj celotno preverjanje
        </Button>

        {/* Auto evaluate + report */}
        <p className="text-sm font-medium text-muted-foreground mt-4">Ocenjevanje + Poročilo</p>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
          onClick={() => invoke("auto_evaluate_and_report")}
          disabled={!!loading}
        >
          <BtnIcon action="auto_evaluate_and_report" />
          {!isLoading("auto_evaluate_and_report") && <ClipboardCheck className="h-4 w-4 mr-2 text-dragon-green" />}
          Simuliraj ocenjevanje + poročilo
        </Button>
        <p className="text-sm font-medium text-muted-foreground mt-4">Simulacija zamude pri testu</p>
        <div className="flex gap-2">
          <Input
            type="number"
            value={daysAgo}
            onChange={(e) => setDaysAgo(e.target.value)}
            className="w-24"
            placeholder="Dni zamude"
          />
          <Button
            variant="outline"
            className="flex-1 justify-start hover:bg-dragon-green/10 hover:border-dragon-green"
            onClick={() => invoke("simulate_delayed_test", { daysAgo: parseInt(daysAgo) })}
            disabled={!!loading}
          >
            <BtnIcon action="simulate_delayed_test" />
            Izračunaj zamudo ({daysAgo}d)
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
          onClick={() => invoke("calculate_cooldown_preview", { delayDays: parseInt(daysAgo) || 0 })}
          disabled={!!loading}
        >
          <BtnIcon action="calculate_cooldown_preview" />
          {!isLoading("calculate_cooldown_preview") && <Eye className="h-4 w-4 mr-2 text-dragon-green" />}
          Predogled cooldown datumov {parseInt(daysAgo) > 0 ? `(+${daysAgo}d zamude)` : ''}
        </Button>

        {cooldownPreview && (
          <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono space-y-1 max-h-60 overflow-auto">
            {cooldownPreview.tests?.map((t: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span>Test {i + 1}: {t.date}</span>
                <span className={
                  t.status === 'opravljen' ? 'text-dragon-green' : 
                  t.status.startsWith('blokiran') ? 'text-destructive font-semibold' :
                  'text-muted-foreground'
                }>
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

        {/* Full lifecycle reset */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm font-medium text-destructive mb-2">Nevarno območje</p>
          <Button
            variant="outline"
            className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
            onClick={() => setShowResetConfirm(true)}
            disabled={!!loading}
          >
            <BtnIcon action="reset_full_lifecycle" />
            {!isLoading("reset_full_lifecycle") && <Trash2 className="h-4 w-4 mr-2" />}
            Ponastavi celoten cikel
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Izbriše vse: teste, ocene, poročila, načrte, napredek in datoteke.
          </p>
        </div>

        <ConfirmDialog
          open={showResetConfirm}
          onOpenChange={setShowResetConfirm}
          title="Ponastavi celoten cikel?"
          description="To bo TRAJNO izbrisalo vse podatke za tega otroka: preverjanja, ocene, poročila, osebne načrte in napredek. Tega dejanja ni mogoče razveljaviti."
          confirmText="Izbriši vse"
          confirmVariant="destructive"
          isLoading={isLoading("reset_full_lifecycle")}
          onConfirm={() => {
            invoke("reset_full_lifecycle").then(() => setShowResetConfirm(false));
          }}
        />
      </div>
    </div>
  );
}
