import { ClipboardCheck, AlertCircle, RotateCcw, Info, CalendarCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { useArticulationTestStatus } from "@/hooks/useArticulationTestStatus";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

export function ArticulationTestProfileSection() {
  const { lastCompletedAt, nextTestDate, isTestAvailable, isLoading, resetTest } = useArticulationTestStatus();

  const handleReset = async () => {
    const success = await resetTest();
    if (success) {
      toast.success("Test izgovorjave je bil ponastavljen.");
    } else {
      toast.error("Napaka pri ponastavitvi testa.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
        <div className="bg-dragon-green text-white p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Test izgovorjave
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
          Test izgovorjave
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
                Test izgovorjave lahko opravljate enkrat na 3 mesece. 
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
                  Opravite test izgovorjave, da preverite govorni razvoj vašega otroka.
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

        {/* Reset Button - for testing */}
        {hasCompletedTest && (
          <div className="pt-2 border-t border-border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-destructive hover:border-destructive"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Ponastavi test (za testiranje)
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ponastavi vse podatke o opravljenem testu (samo za testiranje)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
