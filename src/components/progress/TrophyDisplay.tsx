import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface TrophyDisplayProps {
  trophies: number;
  totalDragons: number;
  dragonsToNextTrophy: number;
}

export function TrophyDisplay({ trophies, totalDragons, dragonsToNextTrophy }: TrophyDisplayProps) {
  const progressToNextTrophy = totalDragons > 0 ? ((totalDragons % 10) / 10) * 100 : 0;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center p-6 bg-gradient-to-br from-app-yellow/20 via-app-orange/10 to-app-yellow/20 rounded-2xl border-2 border-app-yellow/30 shadow-lg"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Trophy className="h-10 w-10 text-app-yellow fill-current drop-shadow-lg" />
        <div>
          <div className="text-4xl font-bold text-dragon-green">{trophies}</div>
          <div className="text-sm text-muted-foreground font-medium">pokali</div>
        </div>
      </div>
      
      {totalDragons > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Do naslednjega pokala</span>
            <span className="font-bold text-dragon-green">{dragonsToNextTrophy} zmajčkov</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-app-yellow to-app-orange h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToNextTrophy}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}