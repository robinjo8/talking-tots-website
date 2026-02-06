import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyPlan, type PlanWeek, type PlanActivity } from "@/hooks/useMonthlyPlan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Play, Dumbbell, Gamepad2, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MojiIzzivi() {
  const { selectedChild } = useAuth();
  const { data: plan, isLoading } = useMonthlyPlan(selectedChild?.id);
  const [activeWeek, setActiveWeek] = useState(0);
  const navigate = useNavigate();

  const isGenerating = plan?.status === "generating";
  const isActive = plan?.status === "active";
  const planData = plan?.plan_data;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {isLoading ? (
          <PlanSkeleton />
        ) : isGenerating ? (
          <GeneratingState />
        ) : isActive && planData ? (
          <ActivePlan
            planData={planData}
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            focusLetters={plan.focus_letters}
            onNavigate={navigate}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <Calendar className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Moj osebni načrt</h2>
      <p className="text-muted-foreground max-w-md">
        Tvoj osebni načrt vaj bo na voljo po prvem preverjanju izgovorjave pri logopedu.
        Ko logopedinja zaključi pregled, se bo načrt samodejno ustvaril.
      </p>
    </div>
  );
}

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Načrt se pripravlja...</h2>
      <p className="text-muted-foreground max-w-md">
        Naš AI asistent pripravlja tvoj osebni mesečni načrt vaj.
        To traja približno 15-20 sekund.
      </p>
    </div>
  );
}

function PlanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-12 w-96 rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

interface ActivePlanProps {
  planData: {
    summary?: string;
    targetLetters?: string[];
    childAge?: number;
    ageGroup?: string;
    weeks?: PlanWeek[];
  };
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  focusLetters: string[];
  onNavigate: (path: string) => void;
}

function ActivePlan({ planData, activeWeek, setActiveWeek, focusLetters, onNavigate }: ActivePlanProps) {
  const weeks = planData.weeks || [];
  const currentWeek = weeks[activeWeek];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Moj osebni načrt</h1>
        </div>
        {planData.summary && (
          <p className="text-muted-foreground text-sm mt-1">{planData.summary}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {focusLetters.map((letter) => (
            <span
              key={letter}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/15 text-primary"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Week tabs */}
      {weeks.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weeks.map((week, index) => (
            <button
              key={index}
              onClick={() => setActiveWeek(index)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeWeek === index
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Teden {week.weekNumber}
            </button>
          ))}
        </div>
      )}

      {/* Week theme */}
      {currentWeek?.theme && (
        <p className="text-sm font-medium text-muted-foreground px-1">
          {currentWeek.theme}
        </p>
      )}

      {/* Days */}
      <AnimatePresence mode="wait">
        {currentWeek && (
          <motion.div
            key={activeWeek}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {currentWeek.days.map((day) => (
              <DayCard key={day.dayNumber} day={day} onNavigate={onNavigate} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DayCardProps {
  day: { dayNumber: number; dayName: string; activities: PlanActivity[] };
  onNavigate: (path: string) => void;
}

function DayCard({ day, onNavigate }: DayCardProps) {
  return (
    <Card className="rounded-2xl border overflow-hidden">
      <div className="bg-muted/50 px-5 py-3 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wide">
          {day.dayName}
        </h3>
      </div>
      <CardContent className="p-0 divide-y">
        {day.activities.map((activity, index) => (
          <ActivityRow
            key={index}
            activity={activity}
            onNavigate={onNavigate}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface ActivityRowProps {
  activity: PlanActivity;
  onNavigate: (path: string) => void;
}

function ActivityRow({ activity, onNavigate }: ActivityRowProps) {
  const isMotor = activity.type === "motorika";

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isMotor
            ? "bg-orange-100 text-orange-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {isMotor ? <Dumbbell className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        {activity.description && (
          <p className="text-xs text-muted-foreground truncate">
            {activity.description}
          </p>
        )}
      </div>

      <span className="text-xs text-muted-foreground flex-shrink-0 mr-2">
        {activity.duration}
      </span>

      <Button
        size="sm"
        variant="outline"
        className="flex-shrink-0 rounded-xl gap-1.5 text-xs h-8"
        onClick={() => onNavigate(activity.path)}
      >
        <Play className="h-3 w-3" />
        Igraj
      </Button>
    </div>
  );
}
