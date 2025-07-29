
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CategoryProgress {
  stars: number; // 0-9 (resets to 0 when reaching 10)
  dragons: number; // earned dragons for this category (0-9)
  totalStars: number; // total stars earned in this category
  totalCompletions: number; // total activities completed
}

export interface EnhancedProgressSummary {
  games: CategoryProgress;
  exercises: CategoryProgress;
  totalTrophies: number;
  totalDragons: number;
}

export const useEnhancedProgress = () => {
  const { selectedChildIndex, profile } = useAuth();
  const queryClient = useQueryClient();

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  // Fetch enhanced progress data
  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ["enhancedProgress", selectedChild?.id],
    queryFn: async (): Promise<EnhancedProgressSummary> => {
      if (!selectedChild?.id) {
        return {
          games: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
          exercises: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
          totalTrophies: 0,
          totalDragons: 0
        };
      }

      // Get activity summary
      const { data: activitySummary } = await supabase
        .rpc('get_child_activity_summary', { child_uuid: selectedChild.id });

      if (!activitySummary) {
        return {
          games: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
          exercises: { stars: 0, dragons: 0, totalStars: 0, totalCompletions: 0 },
          totalTrophies: 0,
          totalDragons: 0
        };
      }

      // Categorize activities
      const gameActivities = activitySummary.filter(a => 
        a.activity_type === 'memory_game' || a.activity_type === 'puzzle'
      );
      const exerciseActivities = activitySummary.filter(a => 
        a.activity_type === 'exercise'
      );

      // Calculate game progress - each completion = 1 star
      const gamesTotalCompletions = gameActivities.reduce((sum, a) => sum + a.completion_count, 0);
      const gameCurrentStars = gamesTotalCompletions % 10; // 0-9 stars
      const gameDragons = Math.floor((gamesTotalCompletions % 100) / 10); // 0-9 dragons
      
      // Calculate exercise progress - each completion = 1 star (1 completion = 27 cards done)
      const exercisesTotalCompletions = exerciseActivities.reduce((sum, a) => sum + a.completion_count, 0);
      const exerciseCurrentStars = exercisesTotalCompletions % 10; // 0-9 stars
      const exerciseDragons = Math.floor((exercisesTotalCompletions % 100) / 10); // 0-9 dragons

      // Calculate total progress across both categories
      const totalCompletions = gamesTotalCompletions + exercisesTotalCompletions;
      const totalTrophies = Math.floor(totalCompletions / 100); // Every 100 completions = 1 trophy
      const totalDragons = Math.floor((totalCompletions % 100) / 10); // Every 10 completions = 1 dragon

      console.log("Progress calculation:", {
        gamesTotalCompletions,
        exercisesTotalCompletions,
        totalCompletions,
        gameCurrentStars,
        exerciseCurrentStars,
        gameDragons,
        exerciseDragons,
        totalTrophies,
        totalDragons
      });

      return {
        games: {
          stars: gameCurrentStars,
          dragons: gameDragons,
          totalStars: gamesTotalCompletions, // Each completion is 1 star
          totalCompletions: gamesTotalCompletions
        },
        exercises: {
          stars: exerciseCurrentStars,
          dragons: exerciseDragons,
          totalStars: exercisesTotalCompletions, // Each completion is 1 star
          totalCompletions: exercisesTotalCompletions
        },
        totalTrophies,
        totalDragons
      };
    },
    enabled: !!selectedChild?.id
  });

  // Mutation to record progress
  const recordProgressMutation = useMutation({
    mutationFn: async (params: {
      activityType: 'exercise' | 'memory_game' | 'puzzle';
      activitySubtype?: string;
      starsEarned?: number;
      sessionMetadata?: any;
    }) => {
      if (!selectedChild?.id) throw new Error("No child selected");

      // Map activity subtypes to proper exercise IDs
      const exerciseIdMap: Record<string, string> = {
        'vaje_motorike_govoril': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'general': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' // Default to vaje motorike govoril
      };

      const exerciseId = exerciseIdMap[params.activitySubtype || 'general'] || exerciseIdMap['general'];

      console.log("Recording progress:", params);

      const { data, error } = await supabase
        .from('progress')
        .insert({
          child_id: selectedChild.id,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhancedProgress", selectedChild?.id] });
    }
  });

  // Helper functions
  const recordGameCompletion = (gameType: string, subtype: string = 'general') => {
    const activityType = gameType === 'memory' ? 'memory_game' : 'puzzle';
    recordProgressMutation.mutate({
      activityType,
      activitySubtype: subtype,
      starsEarned: 1,
      sessionMetadata: { gameType, subtype }
    });
  };

  const recordExerciseCompletion = (exerciseType: string = 'vaje_motorike_govoril') => {
    recordProgressMutation.mutate({
      activityType: 'exercise',
      activitySubtype: exerciseType,
      starsEarned: 1,
      sessionMetadata: { exerciseType }
    });
  };

  return {
    progressData,
    isLoading,
    error,
    recordGameCompletion,
    recordExerciseCompletion,
    selectedChild
  };
};
