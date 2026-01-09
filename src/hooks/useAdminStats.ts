import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminStats {
  totalTests: number;
  pendingTests: number;
  myReviews: number;
  completedTests: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalTests: 0,
    pendingTests: 0,
    myReviews: 0,
    completedTests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAdminAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile) {
        setIsLoading(false);
        return;
      }

      try {
        // Total tests
        const { count: totalCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true });

        // Pending tests
        const { count: pendingCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // My reviews (assigned to me or in_review by me)
        const { count: myCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', profile.id);

        // Completed tests
        const { count: completedCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        setStats({
          totalTests: totalCount || 0,
          pendingTests: pendingCount || 0,
          myReviews: myCount || 0,
          completedTests: completedCount || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  return { stats, isLoading };
}
