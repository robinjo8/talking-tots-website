import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedProgressSummary, CategoryProgress, UnifiedProgressSummary } from '@/hooks/useEnhancedProgress';

interface ActivitySummary {
  activity_type: string;
  activity_subtype: string | null;
  completion_count: number;
  total_stars: number;
}

interface UseLogopedistProgressReturn {
  progressData: EnhancedProgressSummary;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

function getEmptyProgress(): EnhancedProgressSummary {
  return {
    games: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
    exercises: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
    totalTrophies: 0,
    totalDragons: 0,
    unified: {
      totalStars: 0,
      currentStars: 0,
      totalDragons: 0,
      currentDragons: 0,
      totalTrophies: 0,
      starsToNextDragon: 10,
      dragonsToNextTrophy: 10
    }
  };
}

function calculateProgress(summaryData: ActivitySummary[]): EnhancedProgressSummary {
  if (!summaryData || summaryData.length === 0) {
    return getEmptyProgress();
  }

  // Categorize activities - same logic as useEnhancedProgress
  const gameActivities = summaryData.filter(a => 
    a.activity_type === 'memory_game' || a.activity_type === 'puzzle'
  );
  const exerciseActivities = summaryData.filter(a => 
    a.activity_type === 'exercise'
  );

  // Calculate using total_stars instead of completion_count
  const gamesTotalStars = gameActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);
  const exercisesTotalStars = exerciseActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);

  // UNIFIED LOGIC: Total stars = all stars combined
  const totalStars = gamesTotalStars + exercisesTotalStars;
  
  // Current stars = 0-9 stars towards next dragon
  const currentStars = totalStars % 10;
  
  // Total dragons = every 10 stars = 1 dragon
  const totalDragons = Math.floor(totalStars / 10);
  
  // Current dragons = 0-9 dragons towards next trophy
  const currentDragons = totalDragons % 10;
  
  // Total trophies = every 10 dragons (100 stars) = 1 trophy
  const totalTrophies = Math.floor(totalDragons / 10);
  
  // Stars needed for next dragon
  const starsToNextDragon = 10 - currentStars;
  
  // Dragons needed for next trophy
  const dragonsToNextTrophy = 10 - currentDragons;

  console.log("Logopedist progress calculation (unified):", {
    gamesTotalStars,
    exercisesTotalStars,
    totalStars,
    currentStars,
    totalDragons,
    currentDragons,
    totalTrophies,
    starsToNextDragon,
    dragonsToNextTrophy
  });

  return {
    // Keep backwards compatibility structure
    games: {
      stars: gamesTotalStars % 10,
      dragons: Math.floor((gamesTotalStars % 100) / 10),
      totalStars: gamesTotalStars,
      totalCompletions: gameActivities.reduce((sum, a) => sum + (a.completion_count || 0), 0)
    },
    exercises: {
      stars: exercisesTotalStars % 10,
      dragons: Math.floor((exercisesTotalStars % 100) / 10),
      totalStars: exercisesTotalStars,
      totalCompletions: exerciseActivities.reduce((sum, a) => sum + (a.completion_count || 0), 0)
    },
    totalTrophies,
    totalDragons,
    // New unified data
    unified: {
      totalStars,
      currentStars,
      totalDragons,
      currentDragons,
      totalTrophies,
      starsToNextDragon,
      dragonsToNextTrophy
    }
  };
}

export function useLogopedistProgress(logopedistChildId: string | undefined): UseLogopedistProgressReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logopedist-progress', logopedistChildId],
    queryFn: async (): Promise<EnhancedProgressSummary> => {
      if (!logopedistChildId) {
        return getEmptyProgress();
      }

      const { data: summaryData, error: rpcError } = await supabase
        .rpc('get_logopedist_child_activity_summary', {
          logopedist_child_uuid: logopedistChildId
        });

      if (rpcError) {
        console.error('Error fetching logopedist child progress:', rpcError);
        return getEmptyProgress();
      }

      return calculateProgress(summaryData as ActivitySummary[] || []);
    },
    enabled: !!logopedistChildId,
    staleTime: 30000, // 30 seconds
  });

  return {
    progressData: data || getEmptyProgress(),
    isLoading,
    error: error as Error | null,
    refetch
  };
}
