import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Star, Activity, Calendar, ChevronDown } from 'lucide-react';
import { useLogopedistChild } from '@/hooks/useLogopedistChildren';
import { useLogopedistProgress } from '@/hooks/useLogopedistProgress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { UnifiedProgressDisplay } from '@/components/progress/UnifiedProgressDisplay';
import { ActivityBreakdownCard } from '@/components/progress/ActivityBreakdownCard';
import { aggregateActivities } from '@/utils/activityAggregation';

interface ProgressEntry {
  id: string;
  activity_type: string;
  activity_subtype: string | null;
  score: number;
  stars_earned: number | null;
  completed_at: string;
  duration: number;
}

export default function AdminChildProgress() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: child, isLoading: childLoading } = useLogopedistChild(childId);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Use the new hook for unified progress display
  const { progressData, isLoading: progressDataLoading } = useLogopedistProgress(childId);

  // Fetch activity history
  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['logopedist-child-history', childId],
    queryFn: async (): Promise<ProgressEntry[]> => {
      if (!childId) return [];

      const { data, error } = await supabase
        .from('progress')
        .select('id, activity_type, activity_subtype, score, stars_earned, completed_at, duration')
        .eq('logopedist_child_id', childId)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching progress history:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!childId,
  });

  // Aggregate activities for breakdown display
  const aggregatedData = useMemo(() => aggregateActivities(history), [history]);

  const isLoading = childLoading || progressDataLoading || historyLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Otrok ni bil najden.</p>
        <Button variant="link" onClick={() => navigate('/admin/children')}>
          Nazaj na seznam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin/children')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Nazaj na seznam
        </Button>
      </div>

      {/* Child info */}
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center overflow-hidden",
          child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
        )}>
          {child.avatar_url ? (
            <img 
              src={child.avatar_url} 
              alt={child.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">
              {child.gender === 'male' ? '🧒' : '👧'}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Napredek: {child.name}</h1>
          <p className="text-muted-foreground">
            Starost: {child.age} {child.age === 1 ? 'leto' : child.age < 5 ? 'leta' : 'let'}
            {child.speech_difficulties && child.speech_difficulties.length > 0 && (
              <> • Težave: {child.speech_difficulties.join(', ')}</>
            )}
          </p>
        </div>
      </div>

      {/* Unified Progress Display - same as user portal */}
      <UnifiedProgressDisplay 
        progressData={progressData} 
        showTestButtons={false}
      />

      {/* Activity Breakdown - new aggregated view */}
      <ActivityBreakdownCard 
        games={aggregatedData.games}
        exercises={aggregatedData.exercises}
        total={aggregatedData.total}
      />

      {/* Collapsible Activity History */}
      <Card>
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Zgodovina aktivnosti
                </div>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    historyOpen && "rotate-180"
                  )} 
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Še ni zabeleženih aktivnosti.</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate(`/admin/children/${childId}/workspace`)}
                  >
                    Začni delo z otrokom
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground w-24">
                          {format(new Date(entry.completed_at), 'd. MMM yyyy', { locale: sl })}
                        </div>
                        <div>
                          <p className="font-medium">
                            {entry.activity_subtype || entry.activity_type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entry.activity_type}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{entry.score}%</p>
                        </div>
                        {entry.stars_earned !== null && entry.stars_earned > 0 && (
                          <div className="flex items-center gap-1 text-app-orange">
                            {Array.from({ length: entry.stars_earned }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Action button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => navigate(`/admin/children/${childId}/workspace`)}
          className="bg-dragon-green hover:bg-dragon-green/90"
        >
          Začni delo z {child.name}
        </Button>
      </div>
    </div>
  );
}
