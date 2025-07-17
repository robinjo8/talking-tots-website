import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StarDisplay } from "./StarDisplay";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryProgressCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  stars: number; // 0-9
  dragons: number;
  totalCompletions: number;
  progressToNextDragon: number; // 0-100
  dragonImageUrl: string;
}

export function CategoryProgressCard({
  title,
  icon: Icon,
  iconColor,
  bgColor,
  stars,
  dragons,
  totalCompletions,
  progressToNextDragon,
  dragonImageUrl
}: CategoryProgressCardProps) {
  return (
    <Card className={`${bgColor} border-2 border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <h3 className="font-semibold text-lg text-dragon-green">{title}</h3>
          </div>
          <Badge variant="secondary" className="bg-white/50">
            {totalCompletions} opravljenih
          </Badge>
        </div>

        {/* Stars Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Zvezde</span>
            <span className="text-sm font-bold text-dragon-green">{stars}/10</span>
          </div>
          <StarDisplay currentStars={stars} />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Napredek do zmajčka</span>
            <span className="text-xs text-muted-foreground">{10 - stars} zvezdic</span>
          </div>
          <Progress value={progressToNextDragon} className="h-2" />
        </div>

        {/* Dragons Display */}
        <motion.div 
          className="flex items-center justify-center gap-3 p-3 bg-white/30 rounded-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={dragonImageUrl} 
            alt="Dragon" 
            className="h-8 w-8 drop-shadow-md"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-dragon-green">{dragons}</div>
            <div className="text-xs text-muted-foreground font-medium">zmajčkov</div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}