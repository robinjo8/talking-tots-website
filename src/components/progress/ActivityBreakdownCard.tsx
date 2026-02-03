import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ActivityAggregate } from '@/utils/activityAggregation';

interface ActivityBreakdownCardProps {
  games: ActivityAggregate[];
  exercises: ActivityAggregate[];
  total: number;
}

// Color mappings for border, background, text, and progress bar
const colorStyles: Record<string, {
  border: string;
  bg: string;
  text: string;
  progressBg: string;
  progressFill: string;
}> = {
  purple: {
    border: 'border-l-purple-500',
    bg: 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background',
    text: 'text-purple-600 dark:text-purple-400',
    progressBg: 'bg-purple-100 dark:bg-purple-900/30',
    progressFill: '[&>div]:bg-purple-500',
  },
  blue: {
    border: 'border-l-blue-500',
    bg: 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background',
    text: 'text-blue-600 dark:text-blue-400',
    progressBg: 'bg-blue-100 dark:bg-blue-900/30',
    progressFill: '[&>div]:bg-blue-500',
  },
  green: {
    border: 'border-l-green-500',
    bg: 'bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background',
    text: 'text-green-600 dark:text-green-400',
    progressBg: 'bg-green-100 dark:bg-green-900/30',
    progressFill: '[&>div]:bg-green-500',
  },
  orange: {
    border: 'border-l-orange-500',
    bg: 'bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background',
    text: 'text-orange-600 dark:text-orange-400',
    progressBg: 'bg-orange-100 dark:bg-orange-900/30',
    progressFill: '[&>div]:bg-orange-500',
  },
  teal: {
    border: 'border-l-teal-500',
    bg: 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-background',
    text: 'text-teal-600 dark:text-teal-400',
    progressBg: 'bg-teal-100 dark:bg-teal-900/30',
    progressFill: '[&>div]:bg-teal-500',
  },
  pink: {
    border: 'border-l-pink-500',
    bg: 'bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-background',
    text: 'text-pink-600 dark:text-pink-400',
    progressBg: 'bg-pink-100 dark:bg-pink-900/30',
    progressFill: '[&>div]:bg-pink-500',
  },
  rose: {
    border: 'border-l-rose-500',
    bg: 'bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-background',
    text: 'text-rose-600 dark:text-rose-400',
    progressBg: 'bg-rose-100 dark:bg-rose-900/30',
    progressFill: '[&>div]:bg-rose-500',
  },
  amber: {
    border: 'border-l-amber-500',
    bg: 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background',
    text: 'text-amber-600 dark:text-amber-400',
    progressBg: 'bg-amber-100 dark:bg-amber-900/30',
    progressFill: '[&>div]:bg-amber-500',
  },
  yellow: {
    border: 'border-l-yellow-500',
    bg: 'bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background',
    text: 'text-yellow-600 dark:text-yellow-400',
    progressBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    progressFill: '[&>div]:bg-yellow-500',
  },
  indigo: {
    border: 'border-l-indigo-500',
    bg: 'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background',
    text: 'text-indigo-600 dark:text-indigo-400',
    progressBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    progressFill: '[&>div]:bg-indigo-500',
  },
  red: {
    border: 'border-l-red-500',
    bg: 'bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background',
    text: 'text-red-600 dark:text-red-400',
    progressBg: 'bg-red-100 dark:bg-red-900/30',
    progressFill: '[&>div]:bg-red-500',
  },
  cyan: {
    border: 'border-l-cyan-500',
    bg: 'bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-background',
    text: 'text-cyan-600 dark:text-cyan-400',
    progressBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    progressFill: '[&>div]:bg-cyan-500',
  },
  slate: {
    border: 'border-l-slate-500',
    bg: 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-950/20 dark:to-background',
    text: 'text-slate-600 dark:text-slate-400',
    progressBg: 'bg-slate-100 dark:bg-slate-900/30',
    progressFill: '[&>div]:bg-slate-500',
  },
};

function getCountLabel(count: number, type: 'game' | 'exercise'): string {
  if (type === 'exercise') {
    if (count === 1) return '1 opravljena';
    if (count === 2) return '2 opravljeni';
    if (count >= 3 && count <= 4) return `${count} opravljene`;
    return `${count} opravljenih`;
  }
  // game
  if (count === 1) return '1 odigrana';
  if (count === 2) return '2 odigrani';
  if (count >= 3 && count <= 4) return `${count} odigrane`;
  return `${count} odigranih`;
}

function ActivityCard({ activity }: { activity: ActivityAggregate }) {
  const styles = colorStyles[activity.color] || colorStyles.slate;
  
  return (
    <div
      className={cn(
        'p-4 rounded-lg border-l-4 transition-all hover:shadow-md',
        styles.border,
        styles.bg,
        activity.count === 0 && 'opacity-50'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-semibold text-sm text-foreground">{activity.displayName}</h4>
          <p className="text-xs text-muted-foreground">
            {getCountLabel(activity.count, activity.type)}
          </p>
        </div>
        <span className={cn('text-lg font-bold', styles.text)}>
          {activity.percentage}%
        </span>
      </div>
      <Progress 
        value={activity.percentage} 
        className={cn('h-2', styles.progressBg, styles.progressFill)} 
      />
    </div>
  );
}

export function ActivityBreakdownCard({ games, exercises, total }: ActivityBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pregled aktivnosti</CardTitle>
        {total > 0 && (
          <p className="text-sm text-muted-foreground">
            Skupaj {total} {total === 1 ? 'aktivnost' : total < 5 ? 'aktivnosti' : 'aktivnosti'}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Games section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Igre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {games.map((game) => (
              <ActivityCard key={game.gameKey} activity={game} />
            ))}
          </div>
        </div>

        {/* Exercises section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Vaje
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {exercises.map((exercise) => (
              <ActivityCard key={exercise.gameKey} activity={exercise} />
            ))}
          </div>
        </div>

        {total === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Še ni zabeleženih aktivnosti.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
