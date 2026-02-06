import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { motion } from "framer-motion";
import { DayStarDisplay } from "./DayStarDisplay";
import { getGameImage } from "./GameImageMap";
import type { PlanActivity } from "@/hooks/useMonthlyPlan";

interface PlanDayCardProps {
  date: string;
  dayName: string;
  activities: PlanActivity[];
  starsForDay: number;
  completedIndices: Set<number>;
  isToday: boolean;
  planId: string;
  childId: string;
  onActivityPlay: (activityIndex: number, path: string) => void;
}

const MONTH_NAMES_SL = [
  "januar", "februar", "marec", "april", "maj", "junij",
  "julij", "avgust", "september", "oktober", "november", "december"
];

function formatDayHeader(dateStr: string, dayName: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  const month = MONTH_NAMES_SL[d.getMonth()];
  return `${day}. ${month} - ${dayName}`;
}

export function PlanDayCard({
  date,
  dayName,
  activities,
  starsForDay,
  completedIndices,
  isToday,
  onActivityPlay,
}: PlanDayCardProps) {
  const navigate = useNavigate();
  const dayCompleted = starsForDay >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`rounded-2xl overflow-hidden border-2 transition-all ${
        isToday 
          ? "border-primary shadow-lg ring-2 ring-primary/20" 
          : dayCompleted
            ? "border-green-300 bg-green-50/30"
            : "border-border"
      }`}>
        {/* Day header */}
        <div className={`px-4 py-3 flex items-center justify-between ${
          isToday 
            ? "bg-primary/10" 
            : dayCompleted 
              ? "bg-green-100/50" 
              : "bg-muted/50"
        }`}>
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                Danes
              </span>
            )}
            <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
              {formatDayHeader(date, dayName)}
            </h3>
            {dayCompleted && (
              <span className="text-green-600">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
          <DayStarDisplay currentStars={starsForDay} />
        </div>

        {/* Activities */}
        <CardContent className="p-0 divide-y divide-border">
          {activities.map((activity, index) => {
            const isCompleted = completedIndices.has(index);
            const gameImage = getGameImage(activity.gameId, activity.type);

            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  isCompleted ? "bg-green-50/50" : "hover:bg-muted/30"
                }`}
              >
                {/* Game image */}
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  {gameImage ? (
                    <img
                      src={gameImage}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">
                      {activity.type === "motorika" ? "🏋️" : "🎮"}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCompleted ? "text-green-700" : "text-foreground"}`}>
                    {activity.title}
                    {activity.letter && (
                      <span className="text-muted-foreground font-normal"> - {activity.letter}</span>
                    )}
                  </p>
                </div>

                {/* Completion indicator or play button */}
                {isCompleted ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0 rounded-xl gap-1.5 text-xs h-8"
                    onClick={() => onActivityPlay(index, activity.path)}
                  >
                    <Play className="h-3 w-3" />
                    Igraj
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
