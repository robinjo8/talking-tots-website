import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UnifiedProgressSummary {
  totalStars: number;        // Total completions (games + exercises)
  currentStars: number;      // 0-9 stars towards next dragon
  totalDragons: number;      // Total dragons earned (each 10 stars)
  currentDragons: number;    // 0-9 dragons towards next trophy
  totalTrophies: number;     // Total trophies earned (each 10 dragons = 100 stars)
  starsToNextDragon: number; // How many stars needed for next dragon
  dragonsToNextTrophy: number; // How many dragons needed for next trophy
}

// Keep for backwards compatibility
export interface CategoryProgress {
  stars: number;
  dragons: number;
  totalStars: number;
  totalCompletions: number;
}

export interface EnhancedProgressSummary {
  games: CategoryProgress;
  exercises: CategoryProgress;
  totalTrophies: number;
  totalDragons: number;
  // New unified fields
  unified: UnifiedProgressSummary;
}

export const useEnhancedProgress = () => {
  const { selectedChild } = useAuth();
  const queryClient = useQueryClient();

  // Fetch enhanced progress data with staleTime to prevent unnecessary refetches
  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ["enhancedProgress", selectedChild?.id],
    staleTime: 30000, // Data considered fresh for 30 seconds
    gcTime: 60000, // Keep in cache for 60 seconds
    queryFn: async (): Promise<EnhancedProgressSummary> => {
      const emptyProgress: EnhancedProgressSummary = {
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

      if (!selectedChild?.id) {
        return emptyProgress;
      }

      // Get activity summary
      const { data: activitySummary } = await supabase
        .rpc('get_child_activity_summary', { child_uuid: selectedChild.id });

      if (!activitySummary) {
        return emptyProgress;
      }

      // Categorize activities
      const gameActivities = activitySummary.filter(a => 
        a.activity_type === 'memory_game' || a.activity_type === 'puzzle'
      );
      const exerciseActivities = activitySummary.filter(a => 
        a.activity_type === 'exercise'
      );

      // Calculate individual category progress (for backwards compatibility)
      const gamesTotalCompletions = gameActivities.reduce((sum, a) => sum + a.completion_count, 0);
      const exercisesTotalCompletions = exerciseActivities.reduce((sum, a) => sum + a.completion_count, 0);

      // NEW UNIFIED LOGIC:
      // Total stars = all completions combined
      const totalStars = gamesTotalCompletions + exercisesTotalCompletions;
      
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

      console.log("Progress calculation (unified):", {
        gamesTotalCompletions,
        exercisesTotalCompletions,
        totalStars,
        currentStars,
        totalDragons,
        currentDragons,
        totalTrophies,
        starsToNextDragon,
        dragonsToNextTrophy
      });

      return {
        // Keep backwards compatibility
        games: {
          stars: gamesTotalCompletions % 10,
          dragons: Math.floor((gamesTotalCompletions % 100) / 10),
          totalStars: gamesTotalCompletions,
          totalCompletions: gamesTotalCompletions
        },
        exercises: {
          stars: exercisesTotalCompletions % 10,
          dragons: Math.floor((exercisesTotalCompletions % 100) / 10),
          totalStars: exercisesTotalCompletions,
          totalCompletions: exercisesTotalCompletions
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
    },
    enabled: !!selectedChild?.id
  });

  // Mutation to record progress - supports both user children and logopedist children
  const recordProgressMutation = useMutation({
    mutationFn: async (params: {
      activityType: 'exercise' | 'memory_game' | 'puzzle';
      activitySubtype?: string;
      starsEarned?: number;
      sessionMetadata?: any;
      logopedistChildId?: string; // New: for logopedist mode
    }) => {
      // Either selectedChild or logopedistChildId must be provided
      const childId = params.logopedistChildId ? null : selectedChild?.id;
      const logopedistChildId = params.logopedistChildId || null;
      
      if (!childId && !logopedistChildId) {
        throw new Error("No child selected");
      }

      // Map activity subtypes to proper exercise IDs
      const exerciseIdMap: Record<string, string> = {
        'vaje_motorike_govoril': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'general': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      };

      const exerciseId = exerciseIdMap[params.activitySubtype || 'general'] || exerciseIdMap['general'];

      console.log("Recording progress:", { ...params, childId, logopedistChildId });

      const { data, error } = await supabase
        .from('progress')
        .insert({
          child_id: childId,
          logopedist_child_id: logopedistChildId,
          exercise_id: exerciseId,
          activity_type: params.activityType,
          activity_subtype: params.activitySubtype,
          stars_earned: params.starsEarned || 1,
          session_metadata: params.sessionMetadata,
          score: 100,
          correct_answers: 1,
          total_questions: 1,
          duration: 0
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the correct query based on mode
      if (variables.logopedistChildId) {
        queryClient.invalidateQueries({ queryKey: ["enhancedProgress", "logopedist", variables.logopedistChildId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["enhancedProgress", selectedChild?.id] });
      }
    }
  });

  // Helper functions - now support optional logopedistChildId
  const recordGameCompletion = (
    gameType: string, 
    subtype: string = 'general',
    logopedistChildId?: string
  ) => {
    const activityType = gameType === 'memory' ? 'memory_game' : 'puzzle';
    recordProgressMutation.mutate({
      activityType,
      activitySubtype: subtype,
      starsEarned: 1,
      sessionMetadata: { gameType, subtype },
      logopedistChildId
    });
  };

  const recordExerciseCompletion = (
    exerciseType: string = 'vaje_motorike_govoril', 
    starsCount: number = 1,
    logopedistChildId?: string
  ) => {
    recordProgressMutation.mutate({
      activityType: 'exercise',
      activitySubtype: exerciseType,
      starsEarned: starsCount,
      sessionMetadata: { exerciseType, starsCount },
      logopedistChildId
    });
  };

  // New unified recording function
  const recordCompletion = (
    type: 'game' | 'exercise', 
    subtype?: string,
    logopedistChildId?: string
  ) => {
    if (type === 'game') {
      recordGameCompletion('memory', subtype || 'general', logopedistChildId);
    } else {
      recordExerciseCompletion(subtype || 'vaje_motorike_govoril', 1, logopedistChildId);
    }
  };

  return {
    progressData,
    isLoading,
    error,
    recordGameCompletion,
    recordExerciseCompletion,
    recordCompletion,
    selectedChild
  };
};
