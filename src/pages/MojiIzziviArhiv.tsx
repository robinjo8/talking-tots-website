import { useMemo, useState } from "react";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyPlan } from "@/hooks/useMonthlyPlan";
import { useSetTracking, type SetTracking } from "@/hooks/usePlanProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronLeft, ChevronRight, Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MONTH_NAMES = [
  "Januar", "Februar", "Marec", "April", "Maj", "Junij",
  "Julij", "Avgust", "September", "Oktober", "November", "December"
];

const DAY_LABELS = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

function buildCalendarGrid(year: number, month: number): CalendarDay[][] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(year, month);
  
  // Get day of week (Monday = 0)
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Previous month padding
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    currentWeek.push({ date: formatDateStr(prevYear, prevMonth, d), day: d, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push({ date: formatDateStr(year, month, d), day: d, isCurrentMonth: true });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month padding
  if (currentWeek.length > 0) {
    let nextDay = 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (currentWeek.length < 7) {
      currentWeek.push({ date: formatDateStr(nextYear, nextMonth, nextDay), day: nextDay, isCurrentMonth: false });
      nextDay++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export default function MojiIzziviArhiv() {
  const { selectedChild } = useAuth();
  const { data: plan, isLoading } = useMonthlyPlan(selectedChild?.id);
  const { data: trackingEntries = [] } = useSetTracking(plan?.id, selectedChild?.id);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = useMemo(() => formatDateStr(now.getFullYear(), now.getMonth(), now.getDate()), []);

  // Build map: date string -> tracking entry
  const trackingByDate = useMemo(() => {
    const map = new Map<string, SetTracking>();
    for (const entry of trackingEntries) {
      const dateStr = (entry.completed_at || entry.expired_at || entry.started_at).slice(0, 10);
      map.set(dateStr, entry);
    }
    return map;
  }, [trackingEntries]);

  // Plan start date
  const planStartDate = plan?.start_date || plan?.created_at?.slice(0, 10) || "";

  const calendarWeeks = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectedEntry = selectedDate ? trackingByDate.get(selectedDate) || null : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : trackingEntries.length > 0 ? (
          <div className="space-y-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar grid */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {DAY_LABELS.map(label => (
                  <div key={label} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {label}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {calendarWeeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 border-b border-border last:border-b-0">
                  {week.map((calDay) => {
                    const entry = trackingByDate.get(calDay.date);
                    const isToday = calDay.date === todayStr;
                    const isBeforePlan = calDay.date < planStartDate;
                    const isFuture = calDay.date > todayStr;
                    const isSelected = calDay.date === selectedDate;

                    let bgClass = "";
                    let statusIcon = null;

                    if (entry) {
                      if (entry.status === "completed" && entry.total_stars >= 10) {
                        bgClass = "bg-green-100 dark:bg-green-900/30";
                        statusIcon = <Check className="h-3 w-3 text-green-600 dark:text-green-400" />;
                      } else if (entry.status === "completed" || entry.status === "expired") {
                        bgClass = "bg-orange-100 dark:bg-orange-900/30";
                        statusIcon = <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">{entry.total_stars}⭐</span>;
                      }
                    } else if (!isBeforePlan && !isFuture && calDay.isCurrentMonth && planStartDate && calDay.date >= planStartDate) {
                      bgClass = "bg-muted/30";
                      statusIcon = <Minus className="h-3 w-3 text-muted-foreground/50" />;
                    }

                    return (
                      <button
                        key={calDay.date}
                        onClick={() => entry ? setSelectedDate(calDay.date === selectedDate ? null : calDay.date) : undefined}
                        className={`relative flex flex-col items-center justify-center py-2 min-h-[48px] transition-colors
                          ${!calDay.isCurrentMonth ? "opacity-30" : ""}
                          ${isToday ? "ring-2 ring-primary ring-inset" : ""}
                          ${isSelected ? "bg-primary/10" : bgClass}
                          ${entry ? "cursor-pointer hover:bg-primary/5" : "cursor-default"}
                        `}
                      >
                        <span className={`text-sm ${isToday ? "font-bold text-primary" : "text-foreground"}`}>
                          {calDay.day}
                        </span>
                        {statusIcon && (
                          <div className="mt-0.5">{statusIcon}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300" />
                <span>Opravljen sklop</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-100 dark:bg-orange-900/30 border border-orange-300" />
                <span>Delno opravljen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-muted/30 border border-border" />
                <span>Ni vadil</span>
              </div>
            </div>

            {/* Selected day details */}
            {selectedEntry && selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <h3 className="font-semibold mb-2">
                  Sklop {selectedEntry.set_number} — {new Date(selectedDate + "T00:00:00").toLocaleDateString("sl-SI", { weekday: "long", day: "numeric", month: "long" })}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  {selectedEntry.status === "completed" && selectedEntry.total_stars >= 10 ? (
                    <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      <Check className="h-4 w-4" /> V celoti opravljen ({selectedEntry.total_stars} zvezdic)
                    </span>
                  ) : selectedEntry.status === "expired" ? (
                    <span className="text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                      <X className="h-4 w-4" /> Čas je potekel — {selectedEntry.total_stars} zvezdic zbranih
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Delno opravljeno — {selectedEntry.total_stars} zvezdic
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Še ni opravljenih sklopov za prikaz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
