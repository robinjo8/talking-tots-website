import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DayStarDisplay } from "./DayStarDisplay";
import { getGameImage, deriveGameIdFromPath, GAME_TITLE_MAP } from "./GameImageMap";
import type { PlanActivity } from "@/hooks/useMonthlyPlan";

interface PlanDayCardProps {
  date: string;
  dayName: string;
  activities: PlanActivity[];
  starsForDay: number;
  completionCounts: Map<number, number>;
  isToday: boolean;
  isPast: boolean;
  planId: string;
  childId: string;
  childAvatarUrl?: string | null;
  onActivityPlay: (activityIndex: number, activityType: string, path: string) => void;
}

function formatDayHeader(dateStr: string, dayName: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${dayName.toUpperCase()}, ${day}.${month}.${year}`;
}

/** 
 * Get required plays for completion:
 * - motorika: 1 play (worth 2 stars)
 * - igra: 2 plays (each worth 1 star = 2 stars total)
 */
function getRequiredPlays(type: string): number {
  return type === "motorika" ? 1 : 2;
}

export function PlanDayCard({
  date,
  dayName,
  activities,
  starsForDay,
  completionCounts,
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
          {/* Day header */}
          <CollapsibleTrigger asChild>
            <button className={`w-full cursor-pointer transition-colors ${
              isToday 
                ? "bg-primary/10 hover:bg-primary/15" 
                : dayCompleted 
                  ? "bg-accent/10 hover:bg-accent/20" 
                  : "bg-muted/50 hover:bg-muted/70"
            }`}>
              {isToday ? (
                /* Desktop: DANES centered, date below, stars below */
                /* Mobile: date centered, stars below */
                <div className="px-4 py-3">
                  {/* Desktop layout */}
                  <div className="hidden md:flex flex-col items-center gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                      Danes
                    </span>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                        {formatDayHeader(date, dayName)}
                      </h3>
                      {dayCompleted && <Check className="h-4 w-4 text-accent-foreground" />}
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <DayStarDisplay currentStars={starsForDay} />
                  </div>
                  {/* Mobile layout */}
                  <div className="flex md:hidden flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                        {formatDayHeader(date, dayName)}
                      </h3>
                      {dayCompleted && <Check className="h-4 w-4 text-accent-foreground" />}
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <DayStarDisplay currentStars={starsForDay} />
                  </div>
                </div>
              ) : (
                /* Non-today: compact single row */
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                      {formatDayHeader(date, dayName)}
                    </h3>
                    {dayCompleted && <Check className="h-4 w-4 text-accent-foreground" />}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                  <DayStarDisplay currentStars={starsForDay} />
                </div>
              )}
            </button>
          </CollapsibleTrigger>

          {/* Activities - collapsible grid of clickable cards */}
          <CollapsibleContent>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {activities.map((activity, index) => {
                  const playCount = completionCounts.get(index) || 0;
                  const requiredPlays = getRequiredPlays(activity.type);
                  const isCompleted = playCount >= requiredPlays;
                  const effectiveGameId = activity.gameId || deriveGameIdFromPath(activity.path);
                  const gameImage = getGameImage(effectiveGameId, activity.type);

                  const displayImage = activity.type === "motorika" && childAvatarUrl
                    ? childAvatarUrl
                    : gameImage;

                  // Fallback title from GAME_TITLE_MAP if activity.title is empty
                  const baseTitle = activity.title || 
                    (effectiveGameId && GAME_TITLE_MAP[effectiveGameId]) || 
                    (activity.type === "motorika" ? "Vaje za motoriko govoril" : "Igra");
                  const showLetter = activity.letter && !baseTitle.includes(activity.letter);
                  const label = showLetter ? `${baseTitle} ${activity.letter}` : baseTitle;
                  const isDisabled = !isToday || isCompleted;

                  return (
                    <button
                      key={index}
                      onClick={() => onActivityPlay(index, activity.type, activity.path)}
                      disabled={isDisabled}
                      className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl disabled:cursor-default"
                    >
                      <div className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                        isCompleted
                          ? "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-600"
                          : isToday
                            ? "border-border shadow-sm hover:shadow-md hover:scale-[1.03] cursor-pointer"
                            : "border-border opacity-50"
                      }`}>
                        {/* Game image */}
                        <div className="aspect-square bg-muted/50 p-2">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={label}
                              className="w-full h-full object-contain rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              {activity.type === "motorika" ? "🏋️" : "🎮"}
                            </div>
                          )}
                        </div>

                        {/* Completed overlay */}
                        {isCompleted && (
                          <div className="absolute inset-0 bg-green-200/40 dark:bg-green-800/40 flex items-center justify-center">
                            <Check className="h-10 w-10 text-green-600 dark:text-green-400 drop-shadow" />
                          </div>
                        )}

                        {/* Progress indicator for games (show 1/2 or 2/2) */}
                        {activity.type === "igra" && playCount > 0 && !isCompleted && (
                          <div className="absolute top-1 right-1 bg-primary/90 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {playCount}/{requiredPlays}
                          </div>
                        )}

                        {/* Label */}
                        <div className="px-1.5 py-1.5 text-center bg-background/80">
                          <p className="text-[11px] font-semibold truncate text-foreground leading-tight">
                            {label}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
