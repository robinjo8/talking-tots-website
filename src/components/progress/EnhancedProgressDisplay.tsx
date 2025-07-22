
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedProgressSummary } from "@/hooks/useEnhancedProgress";
import { TrophyDisplay } from "./TrophyDisplay";
import { StarDisplay } from "./StarDisplay";
import { DragonDisplay } from "./DragonDisplay";
import { TrophyDialog } from "../exercises/TrophyDialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedProgressDisplayProps {
  progressData: EnhancedProgressSummary;
}

export function EnhancedProgressDisplay({ progressData }: EnhancedProgressDisplayProps) {
  const [showTrophyDialog, setShowTrophyDialog] = useState(false);
  const [lastTotalStars, setLastTotalStars] = useState(0);
  const [trophyExpanded, setTrophyExpanded] = useState(false);
  const [gamesExpanded, setGamesExpanded] = useState(false);
  const [exercisesExpanded, setExercisesExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const dragonsToNextTrophy = 10 - (progressData.totalDragons % 10);
  const totalStars = progressData.games.totalStars + progressData.exercises.totalStars;
  
  // Check if we've reached 100 stars for the first time
  useEffect(() => {
    if (totalStars >= 100 && lastTotalStars < 100) {
      setShowTrophyDialog(true);
    }
    setLastTotalStars(totalStars);
  }, [totalStars, lastTotalStars]);

  return (
    <>
      <TrophyDialog 
        isOpen={showTrophyDialog}
        onClose={() => setShowTrophyDialog(false)}
        totalStars={totalStars}
      />
      
    <div className="space-y-6">
      {/* Trophy Section */}
      <Card className="bg-gradient-to-br from-app-yellow/20 via-app-orange/10 to-app-yellow/20 border-app-yellow/40 shadow-lg">
        <CardContent className="p-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-2xl font-bold text-dragon-green">POKALI</h3>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setTrophyExpanded(!trophyExpanded)}
              >
                {trophyExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-3xl font-bold text-dragon-green mb-2">{progressData.totalTrophies}</div>
            
            {(trophyExpanded || !isMobile) && (
              <>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center mb-4 max-w-lg mx-auto">
                  {progressData.totalTrophies > 0 ? (
                    Array.from({ length: progressData.totalTrophies }, (_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: (index % 10) * 0.1, duration: 0.5 }}
                        className="inline-block"
                      >
                        <img
                          src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal.png"
                          alt="Trophy"
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                          onError={(e) => {
                            console.error("Trophy image failed to load:", e.currentTarget.src);
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/%3E%3Cpath d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18'/%3E%3Cpath d='M4 22h16'/%3E%3Cpath d='M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22'/%3E%3Cpath d='M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22'/%3E%3Cpath d='M18 2H6v7a6 6 0 0 0 12 0V2Z'/%3E%3C/svg%3E";
                          }}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <img
                      src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal_cb.png"
                      alt="Empty trophy"
                      className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-50 col-span-1"
                    />
                  )}
                </div>
                
                {progressData.totalDragons > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Do naslednjega pokala</span>
                      <span className="font-bold text-dragon-green">
                        {dragonsToNextTrophy} zmajčkov
                      </span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-app-yellow to-app-orange h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((progressData.totalDragons % 10) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Games and Exercises Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Games Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-dragon-green/15 to-dragon-green/5 border-dragon-green/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-center text-dragon-green">IGRE</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setGamesExpanded(!gamesExpanded)}
                >
                  {gamesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="mb-4">
                <StarDisplay currentStars={progressData.games.stars} />
              </div>
              
              <div className="mb-4">
                <DragonDisplay currentDragons={progressData.games.dragons} />
              </div>
              
              {(gamesExpanded || !isMobile) && (
                <div className="text-center text-sm text-muted-foreground">
                  Skupaj opravljenih: {progressData.games.totalCompletions}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercises Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-app-blue/15 to-app-blue/5 border-app-blue/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-center text-app-blue">VAJE</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setExercisesExpanded(!exercisesExpanded)}
                >
                  {exercisesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="mb-4">
                <StarDisplay currentStars={progressData.exercises.stars} />
              </div>
              
              <div className="mb-4">
                <DragonDisplay currentDragons={progressData.exercises.dragons} />
              </div>
              
              {(exercisesExpanded || !isMobile) && (
                <div className="text-center text-sm text-muted-foreground">
                  Skupaj opravljenih: {progressData.exercises.totalCompletions}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </>
  );
}
