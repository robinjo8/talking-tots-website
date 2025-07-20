import { motion } from "framer-motion";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useProgressMigration } from "@/hooks/useProgressMigration";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface MotivationalContainerProps {
  childName: string;
}

export function MotivationalContainer({ childName }: MotivationalContainerProps) {
  const { migrateExistingProgress, selectedChild } = useProgressMigration();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-migrate existing progress on component mount
  useEffect(() => {
    if (selectedChild) {
      migrateExistingProgress();
    }
  }, [selectedChild, migrateExistingProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
        {isMobile ? (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-2 cursor-pointer hover:bg-dragon-green/5 transition-colors">
                <CardTitle className="flex items-center justify-between text-xl text-dragon-green">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-dragon-green" />
                     HEJ, {childName?.toUpperCase()}!
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-dragon-green" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-dragon-green" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 flex items-center gap-3">
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png" 
                    alt="Zmajček Tomi" 
                    className="w-full h-full object-contain animate-bounce-gentle"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium italic leading-relaxed">
                    TUKAJ LAHKO SPREMLJAŠ SVOJ NAPREDEK. VSAKO ZVEZDICO SI PRISLUŽIŠ, KO USPEŠNO OPRAVIŠ 
                    ENO VAJO ALI IGRO. KO ZBEREŠ 10 
                    <span className="font-bold"> ZVEZDIC</span>, PRIDOBIŠ ENEGA 
                    <span className="font-bold"> ZMAJČKA</span>. IN KO ZBEREŠ 10 ZMAJČKOV, OSVOJIŠ 
                    <span className="font-bold"> POKAL</span>! 
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ZMAJČEK TOMI TE VES ČAS SPREMLJA IN NAVIJA ZATE – ZATO POGUMNO NAPREJ, KORAK ZA KORAKOM DO CILJA!
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
                <MessageSquare className="h-5 w-5 text-dragon-green" />
                HEJ, {childName?.toUpperCase()}!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <img 
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png" 
                  alt="Zmajček Tomi" 
                  className="w-full h-full object-contain animate-bounce-gentle"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg font-medium italic leading-relaxed">
                  TUKAJ LAHKO SPREMLJAŠ SVOJ NAPREDEK. VSAKO ZVEZDICO SI PRISLUŽIŠ, KO USPEŠNO OPRAVIŠ 
                  ENO VAJO ALI IGRO. KO ZBEREŠ 10 
                  <span className="font-bold"> ZVEZDIC</span>, PRIDOBIŠ ENEGA 
                  <span className="font-bold"> ZMAJČKA</span>. IN KO ZBEREŠ 10 ZMAJČKOV, OSVOJIŠ 
                  <span className="font-bold"> POKAL</span>! 
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  ZMAJČEK TOMI TE VES ČAS SPREMLJA IN NAVIJA ZATE – ZATO POGUMNO NAPREJ, KORAK ZA KORAKOM DO CILJA!
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  );
}