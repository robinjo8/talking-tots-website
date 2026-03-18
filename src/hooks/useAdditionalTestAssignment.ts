import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdditionalAssignment {
  id: string;
  child_id: string;
  assigned_by: string;
  status: string;
  session_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AdditionalTestWord {
  id: string;
  assignment_id: string;
  word: string;
  image: string;
  audio: string | null;
  letter: string | null;
  sort_order: number;
}

/**
 * Hook to check if a child has an active additional test assignment.
 * Used in the user portal to show the "Dodatno preverjanje" card.
 */
export function useAdditionalTestAssignment(childId?: string) {
  const { data: assignment, isLoading, refetch } = useQuery({
    queryKey: ['additional-test-assignment', childId],
    queryFn: async () => {
      if (!childId) return null;

      const { data, error } = await supabase
        .from('additional_test_assignments')
        .select('*')
        .eq('child_id', childId)
        .in('status', ['assigned', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching additional assignment:', error);
        return null;
      }

      return data as AdditionalAssignment | null;
    },
    enabled: !!childId,
  });

  return {
    assignment,
    hasActiveAssignment: !!assignment,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch words for a specific additional test assignment.
 */
export function useAdditionalTestWords(assignmentId?: string) {
  const { data: words, isLoading } = useQuery({
    queryKey: ['additional-test-words', assignmentId],
    queryFn: async () => {
      if (!assignmentId) return [];

      const { data, error } = await supabase
        .from('additional_test_words')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching additional test words:', error);
        return [];
      }

      return data as AdditionalTestWord[];
    },
    enabled: !!assignmentId,
  });

  return { words: words || [], isLoading };
}
