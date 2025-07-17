import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface TrophyDisplayProps {
  trophies: number;
  totalDragons: number;
  dragonsToNextTrophy: number;
}

export function TrophyDisplay({ trophies, totalDragons, dragonsToNextTrophy }: TrophyDisplayProps) {
  return (
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
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            {trophies > 0 ? (
              Array.from({ length: Math.min(trophies, 5) }, (_, index) => (
                <motion.img
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal.png"
                  alt="Trophy"
                  className="w-12 h-12 object-contain"
                />
              ))
            ) : (
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal_cb.png"
                alt="Empty trophy"
                className="w-12 h-12 object-contain opacity-50"
              />
            )}
            {trophies > 5 && (
              <span className="text-dragon-green font-bold text-lg ml-2">
                +{trophies - 5}
              </span>
            )}
          </div>
          
          <div className="text-3xl font-bold text-dragon-green mb-2">{trophies}</div>
          
          {totalDragons > 0 && (
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
                  style={{ width: `${((totalDragons % 10) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}