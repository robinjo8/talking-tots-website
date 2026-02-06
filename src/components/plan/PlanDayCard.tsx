import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DayStarDisplay } from "./DayStarDisplay";
import { getGameImage, deriveGameIdFromPath } from "./GameImageMap";
import type { PlanActivity } from "@/hooks/useMonthlyPlan";

interface PlanDayCardProps {
  date: string;
  dayName: string;
  activities: PlanActivity[];
  starsForDay: number;
  completedIndices: Set<number>;
  isToday: boolean;
  isPast: boolean;
  planId: string;
  childId: string;
  childAvatarUrl?: string | null;
  onActivityPlay: (activityIndex: number, path: string) => void;
}

function formatDayHeader(dateStr: string, dayName: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${dayName.toUpperCase()}, ${day}.${month}.${year}`;
}

export function PlanDayCard({
  date,
  dayName,
  activities,
  starsForDay,
  completedIndices,
  isToday,
  isPast,
  childAvatarUrl,
  onActivityPlay,
}: PlanDayCardProps) {
  const [isOpen, setIsOpen] = useState(isToday);
  const dayCompleted = starsForDay >= 10;
  const isFuture = !isToday && !isPast;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`rounded-2xl overflow-hidden border-2 transition-all ${
          isToday 
            ? "border-primary shadow-lg ring-2 ring-primary/20" 
            : dayCompleted
              ? "border-accent bg-accent/10"
              : isFuture
                ? "border-border opacity-60"
                : "border-border opacity-70"
        }`}>
          {/* Day header - always visible, clickable to toggle */}
          <CollapsibleTrigger asChild>
            <button className={`w-full px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              isToday 
                ? "bg-primary/10 hover:bg-primary/15" 
                : dayCompleted 
                  ? "bg-accent/10 hover:bg-accent/20" 
                  : "bg-muted/50 hover:bg-muted/70"
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
                  <span className="text-accent-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
              <DayStarDisplay currentStars={starsForDay} />
            </button>
          </CollapsibleTrigger>

          {/* Activities - collapsible */}
          <CollapsibleContent>
            <CardContent className="p-0 divide-y divide-border">
              {activities.map((activity, index) => {
                const isCompleted = completedIndices.has(index);
                const effectiveGameId = activity.gameId || deriveGameIdFromPath(activity.path);
                const gameImage = getGameImage(effectiveGameId, activity.type);

                // For motorika, use child avatar if available
                const displayImage = activity.type === "motorika" && childAvatarUrl
                  ? childAvatarUrl
                  : gameImage;

                // Determine if letter should be shown (avoid duplication)
                const showLetter = activity.letter && !activity.title.includes(activity.letter);

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      isCompleted ? "bg-accent/5" : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Game image */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                      {displayImage ? (
                        <img
                          src={displayImage}
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
                      <p className={`text-sm font-medium truncate ${isCompleted ? "text-accent-foreground" : "text-foreground"}`}>
                        {activity.title}
                        {showLetter && (
                          <span className="text-muted-foreground font-normal"> - {activity.letter}</span>
                        )}
                      </p>
                    </div>

                    {/* Completion indicator or play button */}
                    {isCompleted ? (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-accent-foreground" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0 rounded-xl gap-1.5 text-xs h-8"
                        disabled={!isToday}
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
