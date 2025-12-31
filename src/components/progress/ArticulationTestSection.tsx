import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, AlertCircle, RotateCcw, Info } from "lucide-react";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { useArticulationTestStatus } from "@/hooks/useArticulationTestStatus";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ArticulationTestSection = () => {
  const { lastCompletedAt, nextTestDate, isTestAvailable, isLoading, resetTest } = useArticulationTestStatus();

  const handleReset = async () => {
    const success = await resetTest();
    if (success) {
      toast.success("Test izgovorjave je bil ponastavljen");
    } else {
      toast.error("Napaka pri ponastavitvi testa");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-muted/50 animate-pulse">
        <CardContent className="p-6">
          <div className="h-24"></div>
        </CardContent>
      </Card>
    );
  }

  const hasCompletedTest = lastCompletedAt !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden ${!hasCompletedTest ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-amber-500">TEST IZGOVORJAVE</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    Test izgovorjave se opravi ob začetku uporabe aplikacije in nato vsake 3 mesece za spremljanje napredka.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Content */}
          {!hasCompletedTest ? (
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Test izgovorjave še ni bil opravljen.</p>
                <p className="text-sm text-red-600">Prosimo, opravite test za začetno oceno.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-green-700">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <p>
                  <span className="font-medium">Zadnji test opravljen:</span>{" "}
                  {format(lastCompletedAt, "d. MMMM yyyy", { locale: sl })}
                </p>
              </div>
              {nextTestDate && (
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <p>
                    <span className="font-medium">Naslednji test:</span>{" "}
                    {format(nextTestDate, "d. MMMM yyyy", { locale: sl })}
                    {isTestAvailable && (
                      <span className="ml-2 text-orange-600 font-medium">(Na voljo!)</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reset button for testing */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset test (za testiranje)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
