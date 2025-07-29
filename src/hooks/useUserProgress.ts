import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ActivityProgress {
  activity_type: 'exercise' | 'memory_game' | 'puzzle';
  activity_subtype: string | null;
  completion_count: number;
  total_stars: number;
}

export interface ProgressSummary {
  totalStars: number;
  totalDragons: number;
  exercises: ActivityProgress[];
  memoryGames: ActivityProgress[];
  puzzles: ActivityProgress[];
}

export const useUserProgress = () => {
  const { selectedChild } = useAuth();
  const queryClient = useQueryClient();

  // Fetch child's progress summary
  const { data: progressSummary, isLoading, error } = useQuery({
    queryKey: ["userProgress", selectedChild?.id],
    queryFn: async (): Promise<ProgressSummary> => {
      if (!selectedChild?.id) {
        return {
          totalStars: 0,
          totalDragons: 0,
          exercises: [],
          memoryGames: [],
          puzzles: []
        };
      }

      // Get total stars
      const { data: totalStars } = await supabase
        .rpc('get_child_total_stars', { child_uuid: selectedChild.id });

      // Get activity summary
      const { data: activitySummary } = await supabase
        .rpc('get_child_activity_summary', { child_uuid: selectedChild.id });

      const exercises = activitySummary?.filter(a => a.activity_type === 'exercise') || [];
      const memoryGames = activitySummary?.filter(a => a.activity_type === 'memory_game') || [];
      const puzzles = activitySummary?.filter(a => a.activity_type === 'puzzle') || [];

      return {
        totalStars: totalStars || 0,
        totalDragons: Math.floor((totalStars || 0) / 10),
        exercises,
        memoryGames,
        puzzles
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

      const { data, error } = await supabase
        .from('progress')
        .insert({
          child_id: selectedChild.id,
          exercise_id: '00000000-0000-0000-0000-000000000000', // dummy exercise id for now
          activity_type: params.activityType,
          activity_subtype: params.activitySubtype,
          stars_earned: params.starsEarned || 1,
          session_metadata: params.sessionMetadata,
          score: 100, // dummy score
          correct_answers: 1, // dummy
          total_questions: 1, // dummy
          duration: 0 // dummy
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refresh progress data
      queryClient.invalidateQueries({ queryKey: ["userProgress", selectedChild?.id] });
    }
  });

  // Helper functions to record different types of progress
  const recordExerciseCompletion = (completionCount: number = 1) => {
    recordProgressMutation.mutate({
      activityType: 'exercise',
      activitySubtype: 'vaje_motorike_govoril',
      starsEarned: completionCount * 10, // Full cycle = 10 stars
      sessionMetadata: { completionCount }
    });
  };

  const recordMemoryGameCompletion = (gameType: string = 'general') => {
    recordProgressMutation.mutate({
      activityType: 'memory_game',
      activitySubtype: gameType,
      starsEarned: 1,
      sessionMetadata: { gameType }
    });
  };

  const recordPuzzleCompletion = (puzzleType: string, completionTime?: number) => {
    recordProgressMutation.mutate({
      activityType: 'puzzle',
      activitySubtype: puzzleType,
      starsEarned: 1,
      sessionMetadata: { puzzleType, completionTime }
    });
  };

  return {
    progressSummary,
    isLoading,
    error,
    recordExerciseCompletion,
    recordMemoryGameCompletion,
    recordPuzzleCompletion,
    selectedChild
  };
};