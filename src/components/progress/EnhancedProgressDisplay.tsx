
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedProgressSummary, useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { TrophyDisplay } from "./TrophyDisplay";
import { StarDisplay } from "./StarDisplay";
import { DragonDisplay } from "./DragonDisplay";
import { TrophyDialog } from "../exercises/TrophyDialog";
import { InfoButton } from "./InfoButton";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedProgressDisplayProps {
  progressData: EnhancedProgressSummary;
}

export function EnhancedProgressDisplay({ progressData }: EnhancedProgressDisplayProps) {
  const { selectedChild } = useAuth();
  const { recordGameCompletion, recordExerciseCompletion } = useEnhancedProgress();
  const [showTrophyDialog, setShowTrophyDialog] = useState(false);
  
  const dragonsToNextTrophy = 10 - (progressData.totalDragons % 10);
  const totalStars = progressData.games.totalStars + progressData.exercises.totalStars;

  const addGameStars = async () => {
    for (let i = 0; i < 9; i++) {
      recordGameCompletion('memory', 'test');
    }
  };

  const addExerciseStars = async () => {
    for (let i = 0; i < 9; i++) {
      recordExerciseCompletion('test');
    }
  };
  
  // Check if we've reached 100 stars and haven't shown the dialog yet
  useEffect(() => {
    if (!selectedChild?.id) return;
    
    const storageKey = `trophy_dialog_shown_${selectedChild.id}`;
    const hasShown = localStorage.getItem(storageKey);
    
    if (totalStars >= 100 && !hasShown) {
      setShowTrophyDialog(true);
      localStorage.setItem(storageKey, 'true');
    }
  }, [totalStars, selectedChild?.id]);

  const handleCloseTrophyDialog = () => {
    setShowTrophyDialog(false);
  };

  return (
    <>
      <TrophyDialog 
        isOpen={showTrophyDialog}
        onClose={handleCloseTrophyDialog}
        totalStars={totalStars}
      />
      
    <div className="space-y-6">
      {/* Trophy Section */}
      <TrophyDisplay 
        trophies={progressData.totalTrophies}
        totalDragons={progressData.totalDragons}
        dragonsToNextTrophy={dragonsToNextTrophy}
      />
      
      {/* Games and Exercises Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Games Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-dragon-green/15 to-dragon-green/5 border-dragon-green/30 shadow-lg relative">
            <InfoButton 
              title="O zvezdicah in zmajčkih"
              content="Zvezdico si prislužiš za vsako opravljeno vajo ali zaključeno igro. Vsaka zvezdica pomeni, da si naredil nekaj dobrega zase in za svoj govor. Ko zbereš 10 zvezdic si prislužiš enega zmajčka – to je znak, da vztrajno napreduješ!

Zmajček je nagrada za vztrajnost. Pridobiš ga, ko zbereš 10 zvezdic. Zmajček pomeni, da si že desetkrat pridno vadil in se učil. Zmajčki spremljajo tvoj napredek in rastejo skupaj s tabo – čim več jih imaš, tem boljši postajaš!"
            />
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-dragon-green mb-6">IGRE</h3>
              
              <div className="mb-4">
                <StarDisplay currentStars={progressData.games.stars} />
              </div>
              
              <div className="mb-4">
                <DragonDisplay currentDragons={progressData.games.dragons} />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Skupaj opravljenih: {progressData.games.totalCompletions}
              </div>
              
              <Button 
                onClick={addGameStars}
                size="sm"
                className="mt-4 w-full bg-dragon-green hover:bg-dragon-green/80"
              >
                +9 zvezdic (test)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercises Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-app-blue/15 to-app-blue/5 border-app-blue/30 shadow-lg relative">
            <InfoButton 
              title="O zvezdicah in zmajčkih"
              content="Zvezdico si prislužiš za vsako opravljeno vajo ali zaključeno igro. Vsaka zvezdica pomeni, da si naredil nekaj dobrega zase in za svoj govor. Ko zbereš 10 zvezdic si prislužiš enega zmajčka – to je znak, da vztrajno napreduješ!

Zmajček je nagrada za vztrajnost. Pridobiš ga, ko zbereš 10 zvezdic. Zmajček pomeni, da si že desetkrat pridno vadil in se učil. Zmajčki spremljajo tvoj napredek in rastejo skupaj s tabo – čim več jih imaš, tem boljši postajaš!"
            />
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-app-blue mb-6">VAJE</h3>
              
              <div className="mb-4">
                <StarDisplay currentStars={progressData.exercises.stars} />
              </div>
              
              <div className="mb-4">
                <DragonDisplay currentDragons={progressData.exercises.dragons} />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Skupaj opravljenih: {progressData.exercises.totalCompletions}
              </div>
              
              <Button 
                onClick={addExerciseStars}
                size="sm"
                className="mt-4 w-full bg-app-blue hover:bg-app-blue/80"
              >
                +9 zvezdic (test)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </>
  );
}
