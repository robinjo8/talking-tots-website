import { useState } from "react";
import { ClipboardCheck, AlertCircle, RotateCcw, Info, CalendarCheck, CalendarClock, Play, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { useArticulationTestStatus } from "@/hooks/useArticulationTestStatus";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useDevAccess } from "@/hooks/useDevAccess";

export function ArticulationTestProfileSection() {
  const { lastCompletedAt, nextTestDate, isTestAvailable, isLoading, resetTest, refetch } = useArticulationTestStatus();
  const { selectedChild, user } = useAuth();
  const navigate = useNavigate();
  const { isDev } = useDevAccess();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isResettingAdditional, setIsResettingAdditional] = useState(false);

  const handleReset = async () => {
    const success = await resetTest();
    if (success) {
      toast.success("Test izgovorjave je bil ponastavljen.");
    } else {
      toast.error("Napaka pri ponastavitvi testa.");
    }
  };

  const handleResetAdditionalTest = async () => {
    if (!selectedChild?.id) {
      toast.error("Najprej izberite otroka.");
      return;
    }
    setIsResettingAdditional(true);
    try {
      const response = await supabase.functions.invoke("reset-additional-test", {
        body: { childId: selectedChild.id },
      });

      if (response.error) {
        console.error("Reset additional test error:", response.error);
        toast.error("Napaka pri ponastavitvi dodatnega preverjanja.");
      } else if (response.data?.deleted === 0) {
        toast.info("Ni dodatnih preverjanj za ponastavitev.");
      } else {
        toast.success(`Dodatno preverjanje ponastavljen (${response.data.deleted} dodelitev).`);
        await refetch();
      }
    } catch (err) {
      console.error("Error resetting additional test:", err);
      toast.error("Napaka pri ponastavitvi dodatnega preverjanja.");
    } finally {
      setIsResettingAdditional(false);
    }
  };

  const handleSimulate = async () => {
    if (!selectedChild?.id) {
      toast.error("Najprej izberite otroka.");
      return;
    }
    setIsSimulating(true);
    setSimulationProgress(5);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => Math.min(prev + 1.5, 95));
    }, 1000);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Niste prijavljeni.");
        return;
      }

      const response = await supabase.functions.invoke("simulate-articulation-test", {
        body: { childId: selectedChild.id },
      });

      clearInterval(progressInterval);

      if (response.error) {
        console.error("Simulation error:", response.error);
        toast.error("Napaka pri simulaciji testa.");
      } else {
        setSimulationProgress(100);
        toast.success(`Simulacija uspešna! Seja-${response.data.sessionNumber} ustvarjena.`);
        await refetch();
      }
    } catch (err) {
      console.error("Simulate error:", err);
      toast.error("Napaka pri simulaciji testa.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationProgress(0);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
        <div className="bg-dragon-green text-white p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Preverjanje izgovorjave
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
        </div>
      </div>
    );
  }

  const hasCompletedTest = lastCompletedAt !== null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header - matching Moji dokumenti style */}
      <div className="bg-dragon-green text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Preverjanje izgovorjave
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p>
                Preverjanje izgovorjave lahko opravljate enkrat na 3 mesece.
                Po opravljenem testu bo logoped pregledal rezultate in pripravil poročilo.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Card */}
        <div className={`rounded-lg p-4 ${
          hasCompletedTest 
            ? 'bg-dragon-green/10 border border-dragon-green/20' 
            : 'bg-amber-50 border border-amber-200'
        }`}>
          {hasCompletedTest ? (
            <div className="flex items-start gap-3">
              <CalendarCheck className="h-5 w-5 text-dragon-green shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dragon-green">Test je bil opravljen</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Zadnji test: {format(lastCompletedAt, "d. MMMM yyyy", { locale: sl })}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Test še ni bil opravljen</p>
                <p className="text-sm text-amber-700 mt-1">
                  Prosimo, opravite test za začetno oceno.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Next Test Date */}
        {nextTestDate && (
          <div className="rounded-lg p-4 bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Naslednji test</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isTestAvailable 
                    ? "Test je na voljo za ponovitev" 
                    : `Na voljo od: ${format(nextTestDate, "d. MMMM yyyy", { locale: sl })}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Simulation & Reset - for testing (dev users only) */}
        {isDevUser(user?.email) && (
        <div className="rounded-lg border border-dragon-green/30 overflow-hidden">
          <div className="bg-dragon-green/10 px-4 py-2 border-b border-dragon-green/20">
            <p className="font-medium text-dragon-green text-sm">🧪 Orodja za testiranje</p>
          </div>
          <div className="p-4 space-y-3">
            {isSimulating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Simulacija poteka...</span>
                  <span>{Math.round(simulationProgress)}%</span>
                </div>
                <Progress value={simulationProgress} className="h-2" />
              </div>
            )}
            <Button
              variant="outline"
              className="w-full justify-start text-left hover:bg-dragon-green/10 hover:border-dragon-green"
              onClick={handleSimulate}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2 text-dragon-green" />
              )}
              {isSimulating ? "Simulacija poteka..." : "Izvedi test (simulacija)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Ponastavi test (za testiranje)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAdditionalTest}
              disabled={isResettingAdditional}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive"
            >
              {isResettingAdditional ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Ponastavi dodatno preverjanje
            </Button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
