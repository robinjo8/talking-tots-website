import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DayStarDisplay } from "./DayStarDisplay";
import { getGameImage, deriveGameIdFromPath, GAME_TITLE_MAP } from "./GameImageMap";
import type { PlanActivity } from "@/hooks/useMonthlyPlan";

interface PlanSetCardProps {
  setNumber: number;
  totalSets: number;
  activities: PlanActivity[];
  totalStars: number;
  completionCounts: Map<number, number>;
  isActive: boolean;
  isCompleted: boolean;
  isExpired: boolean;
  isLocked: boolean;
  timeRemaining?: string;
  childAvatarUrl?: string | null;
  onActivityPlay: (activityIndex: number, activityType: string, path: string) => void;
}

function getRequiredPlays(type: string): number {
  return type === "motorika" ? 1 : 2;
}

export function PlanSetCard({
  setNumber,
  totalSets,
  activities,
  totalStars,
  completionCounts,
  isActive,
  isCompleted,
  isExpired,
  isLocked,
  timeRemaining,
  childAvatarUrl,
  onActivityPlay,
}: PlanSetCardProps) {
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`rounded-2xl overflow-hidden border-2 transition-all ${
          isActive 
            ? "border-primary shadow-lg ring-2 ring-primary/20" 
            : isCompleted
              ? "border-accent bg-accent/10"
              : isExpired
                ? "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-600"
                : "border-border opacity-60"
        }`}>
          <CollapsibleTrigger asChild>
            <button className={`w-full cursor-pointer transition-colors ${
              isActive 
                ? "bg-primary/10 hover:bg-primary/15" 
                : isCompleted 
                  ? "bg-accent/10 hover:bg-accent/20" 
                  : "bg-muted/50 hover:bg-muted/70"
            }`}>
              <div className="px-4 py-3">
                {isActive ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                      Na vrsti
                    </span>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                        Sklop {setNumber}/{totalSets}
                      </h3>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <DayStarDisplay currentStars={totalStars} />
                    {timeRemaining && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Še {timeRemaining}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCompleted && <Check className="h-4 w-4 text-accent" />}
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                        Sklop {setNumber}
                      </h3>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <DayStarDisplay currentStars={totalStars} />
                  </div>
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {activities.map((activity, index) => {
                  const playCount = completionCounts.get(index) || 0;
                  const requiredPlays = getRequiredPlays(activity.type);
                  const isActivityCompleted = playCount >= requiredPlays;
                  const effectiveGameId = activity.gameId || deriveGameIdFromPath(activity.path);
                  const gameImage = getGameImage(effectiveGameId, activity.type);

                  const displayImage = activity.type === "motorika" && childAvatarUrl
                    ? childAvatarUrl
                    : gameImage;

                  const baseTitle = activity.title || 
                    (effectiveGameId && GAME_TITLE_MAP[effectiveGameId]) || 
                    (activity.type === "motorika" ? "Vaje za motoriko govoril" : "Igra");
                  const showLetter = activity.letter && !baseTitle.includes(activity.letter);
                  const label = showLetter ? `${baseTitle} ${activity.letter}` : baseTitle;
                  const isDisabled = !isActive || isActivityCompleted || isLocked;

                  return (
                    <button
                      key={index}
                      onClick={() => onActivityPlay(index, activity.type, activity.path)}
                      disabled={isDisabled}
                      className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl disabled:cursor-default"
                    >
                      <div className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                        isActivityCompleted
                          ? "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-600"
                          : isActive && !isLocked
                            ? "border-border shadow-sm hover:shadow-md hover:scale-[1.03] cursor-pointer"
                            : "border-border opacity-50"
                      }`}>
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

                        {isActivityCompleted && (
                          <div className="absolute inset-0 bg-green-200/40 dark:bg-green-800/40" />
                        )}

                        {activity.type === "igra" && playCount > 0 && !isActivityCompleted && (
                          <div className="absolute top-1 right-1 bg-primary/90 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {playCount}/{requiredPlays}
                          </div>
                        )}

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
