import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { EnhancedProgressSummary } from "@/hooks/useEnhancedProgress";

interface EnhancedProgressDisplayProps {
  progressData: EnhancedProgressSummary;
}

export function EnhancedProgressDisplay({ progressData }: EnhancedProgressDisplayProps) {
  // Star display component for 10-star row
  const StarRow = ({ stars }: { stars: number }) => {
    return (
      <div className="flex gap-1 justify-center mb-4">
        {Array.from({ length: 10 }, (_, index) => (
          <motion.img
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            src={index < stars 
              ? "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/zvezdica.png"
              : "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/zvezdica_cb.png"
            }
            alt={index < stars ? "Filled star" : "Empty star"}
            className="w-8 h-8 object-contain"
          />
        ))}
      </div>
    );
  };

  // Dragon row component
  const DragonRow = ({ dragons }: { dragons: number }) => {
    const displayDragons = Math.min(dragons, 10); // Show max 10 dragons
    
    return (
      <div className="flex gap-2 justify-center mb-4">
        {Array.from({ length: displayDragons }, (_, index) => (
          <motion.img
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
            alt="Dragon"
            className="w-10 h-10 object-contain"
          />
        ))}
        {dragons > 10 && (
          <span className="text-dragon-green font-bold text-lg self-center ml-2">
            +{dragons - 10}
          </span>
        )}
      </div>
    );
  };

  // Trophy display at the top
  const TrophySection = () => {
    return (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 p-6 bg-gradient-to-br from-app-yellow/20 via-app-orange/10 to-app-yellow/20 rounded-2xl border-2 border-app-yellow/40 shadow-lg"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-12 w-12 text-app-yellow fill-current drop-shadow-lg" />
          <div>
            <div className="text-5xl font-bold text-dragon-green">{progressData.totalTrophies}</div>
            <div className="text-sm text-muted-foreground font-medium">pokali</div>
          </div>
        </div>
        
        {progressData.totalDragons > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Do naslednjega pokala</span>
              <span className="font-bold text-dragon-green">
                {10 - (progressData.totalDragons % 10)} zmajčkov
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-app-yellow to-app-orange h-3 rounded-full transition-all duration-500"
                style={{ width: `${((progressData.totalDragons % 10) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <TrophySection />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Games Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-6 bg-gradient-to-br from-app-orange/15 to-app-orange/5 rounded-2xl border-2 border-app-orange/30 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-center text-app-orange mb-6">IGRE</h3>
          <StarRow stars={progressData.games.stars} />
          <DragonRow dragons={progressData.games.dragons} />
          <div className="text-center text-sm text-muted-foreground">
            Skupaj opravljenih: {progressData.games.totalCompletions}
          </div>
        </motion.div>

        {/* Exercises Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-6 bg-gradient-to-br from-app-blue/15 to-app-blue/5 rounded-2xl border-2 border-app-blue/30 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-center text-app-blue mb-6">VAJE</h3>
          <StarRow stars={progressData.exercises.stars} />
          <DragonRow dragons={progressData.exercises.dragons} />
          <div className="text-center text-sm text-muted-foreground">
            Skupaj opravljenih: {progressData.exercises.totalCompletions}
          </div>
        </motion.div>
      </div>
    </div>
  );
}