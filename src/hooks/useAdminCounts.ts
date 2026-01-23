import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function useAdminCounts() {
  const { profile } = useAdminAuth();

  // Query for pending count (unassigned sessions)
  const pendingQuery = useQuery({
    queryKey: ['admin-pending-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .is('assigned_to', null);

      if (error) {
        console.error('Error fetching pending count:', error);
        return 0;
      }
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Query for my reviews count (assigned to current logopedist)
  const myReviewsQuery = useQuery({
    queryKey: ['admin-my-reviews-count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;

      const { count, error } = await supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', profile.id)
        .in('status', ['assigned', 'in_review']);

      if (error) {
        console.error('Error fetching my reviews count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!profile?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    pendingCount: pendingQuery.data ?? 0,
    myReviewsCount: myReviewsQuery.data ?? 0,
    isLoading: pendingQuery.isLoading || myReviewsQuery.isLoading,
  };
}
