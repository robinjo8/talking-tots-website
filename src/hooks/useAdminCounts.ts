import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function useAdminCounts() {
  const { profile } = useAdminAuth();

  const isInternal = profile?.organization_type === 'internal';

  // Query for pending count (unassigned sessions)
  const pendingQuery = useQuery({
    queryKey: ['admin-pending-count', isInternal],
    queryFn: async () => {
      let query = supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('is_completed', true)
        .is('assigned_to', null);

      // Interni logopedi: samo seje staršev
      if (isInternal) {
        query = query.eq('source_type', 'parent');
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error fetching pending count:', error);
        return 0;
      }
      return count || 0;
    },
    refetchInterval: 30000,
  });

  // Query for my reviews count (assigned to current logopedist)
  const myReviewsQuery = useQuery({
    queryKey: ['admin-my-reviews-count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;

      // Štej vse seje dodeljene meni BREZ končnega poročila (completed_at IS NULL)
      const { count, error } = await supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', profile.id)
        .is('completed_at', null);

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
