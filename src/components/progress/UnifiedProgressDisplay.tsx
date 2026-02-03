import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedProgressSummary } from "@/hooks/useEnhancedProgress";
import { ProgressChart } from "./ProgressChart";
import { StarDisplay } from "./StarDisplay";
import { DragonDisplay } from "./DragonDisplay";
import { InfoButton } from "./InfoButton";

interface UnifiedProgressDisplayProps {
  progressData: EnhancedProgressSummary;
  recordCompletion?: (type: 'game' | 'exercise', subtype?: string) => void;
  showTestButtons?: boolean;
}

export function UnifiedProgressDisplay({ progressData, recordCompletion, showTestButtons = false }: UnifiedProgressDisplayProps) {
  // Safe access to unified data with fallback
  const unified = progressData?.unified ?? {
    totalStars: 0,
    currentStars: 0,
    totalDragons: 0,
    currentDragons: 0,
    totalTrophies: 0,
    starsToNextDragon: 10,
    dragonsToNextTrophy: 10
  };
  
  // Add test stars (unified)
  const addTestStars = () => {
    for (let i = 0; i < 9; i++) {
      recordCompletion('game', 'test');
    }
  };
  
  // Add single test star
  const addOneStar = () => {
    recordCompletion('game', 'test');
  };

  // TrophyDialog is now managed globally by TrophyProvider

  return (
    <>
      
      <div className="space-y-6">
        {/* POKALI Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-app-yellow/20 via-app-orange/10 to-app-yellow/20 border-app-yellow/40 shadow-lg relative">
            <InfoButton 
              title="O pokalih"
              content="Pokal je največja nagrada in dokaz, da si res trdno in redno vadil. Pridobiš ga, ko zbereš 10 zmajčkov – to pomeni kar 100 zvezdic! Pokal pokaže, da si izjemno vztrajen, pogumen in pripravljen premagati vsako govorno nalogo."
            />
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-amber-500 mb-6">POKALI</h3>
              
              {/* Progress Chart */}
              <ProgressChart 
                currentDragons={unified.currentDragons} 
                totalTrophies={unified.totalTrophies}
              />
              
              {/* Trophy display - linear row */}
              {unified.totalTrophies > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {Array.from({ length: unified.totalTrophies }, (_, index) => (
                    <motion.img
                      key={index}
                      src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/pokal.png"
                      alt={`Pokal ${index + 1}`}
                      className="w-8 h-8 md:w-10 md:h-10 object-contain"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              )}
              
              {unified.totalTrophies === 0 && (
                <div className="mt-4 flex justify-center">
                  <img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/pokal_cb.png"
                    alt="Neosvojen pokal"
                    className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-30"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ZMAJČKI Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-dragon-green/15 to-dragon-green/5 border-dragon-green/30 shadow-lg relative">
            <InfoButton 
              title="O zmajčkih"
              content="Zmajček je nagrada za vztrajnost. Pridobiš ga, ko zbereš 10 zvezdic. Zmajček pomeni, da si že desetkrat pridno vadil in se učil. Zmajčki spremljajo tvoj napredek in rastejo skupaj s tabo – čim več jih imaš, tem boljši postajaš! Ko zbereš 10 zmajčkov, dobiš pokal!"
            />
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-dragon-green mb-6">ZMAJČKI</h3>
              
              <div className="mb-4">
                <DragonDisplay currentDragons={unified.currentDragons} />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <span className="font-semibold text-dragon-green">{unified.currentDragons}</span>
                <span> od 10 zmajčkov do naslednjega pokala</span>
              </div>
              
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Skupaj zmajčkov: <span className="font-bold">{unified.totalDragons}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* IGRE IN VAJE Section (unified stars) */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-app-blue/15 to-app-blue/5 border-app-blue/30 shadow-lg relative">
            <InfoButton 
              title="O zvezdicah"
              content="Zvezdico si prislužiš za vsako opravljeno vajo ali zaključeno igro. Vsaka zvezdica pomeni, da si naredil nekaj dobrega zase in za svoj govor. Ko zbereš 10 zvezdic si prislužiš enega zmajčka – to je znak, da vztrajno napreduješ!"
            />
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-app-blue mb-6">IGRE IN VAJE</h3>
              
              <div className="mb-4">
                <StarDisplay currentStars={unified.currentStars} />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <span className="font-semibold text-app-blue">{unified.currentStars}</span>
                <span> od 10 zvezdic do naslednjega zmajčka</span>
              </div>
              
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Skupaj zvezdic: <span className="font-bold">{unified.totalStars}</span>
              </div>
              
              {/* Test buttons - only shown when explicitly enabled */}
              {showTestButtons && recordCompletion && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={addOneStar}
                    size="sm"
                    className="flex-1 bg-app-blue hover:bg-app-blue/80"
                  >
                    +1 zvezdica (test)
                  </Button>
                  <Button 
                    onClick={addTestStars}
                    size="sm"
                    className="flex-1 bg-app-blue hover:bg-app-blue/80"
                  >
                    +9 zvezdic (test)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
