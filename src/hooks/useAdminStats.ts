import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminStats {
  // Organization stats
  orgTotalTests: number;
  orgPendingTests: number;
  orgReviewedTests: number;
  orgCompletedTests: number;
  
  // Personal stats
  myTotalReviews: number;
  myInReviewCount: number;
  myReviewedCount: number;
  myCompletedCount: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    orgTotalTests: 0,
    orgPendingTests: 0,
    orgReviewedTests: 0,
    orgCompletedTests: 0,
    myTotalReviews: 0,
    myInReviewCount: 0,
    myReviewedCount: 0,
    myCompletedCount: 0,
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
        // Organization stats - all tests in the system
        const { count: orgTotalCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true });

        // Organization - pending tests (status = pending)
        const { count: orgPendingCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Organization - reviewed tests (reviewed_at set, completed_at NOT set)
        const { data: orgReviewedData } = await supabase
          .from('articulation_test_sessions')
          .select('id, reviewed_at, completed_at, status')
          .is('completed_at', null);
        
        const orgReviewedCount = orgReviewedData?.filter(s => 
          s.reviewed_at || s.status === 'completed'
        ).length || 0;

        // Organization - completed tests (completed_at IS set)
        const { count: orgCompletedCount } = await supabase
          .from('articulation_test_sessions')
          .select('*', { count: 'exact', head: true })
          .not('completed_at', 'is', null);

        // Personal stats - my assigned reviews
        const { data: myReviews } = await supabase
          .from('articulation_test_sessions')
          .select('id, status, reviewed_at, completed_at')
          .eq('assigned_to', profile.id);

        const myData = myReviews || [];
        const myTotalReviews = myData.length;
        
        // In review = assigned but not reviewed yet
        const myInReviewCount = myData.filter(s => 
          !s.reviewed_at && s.status !== 'completed' && !s.completed_at
        ).length;
        
        // Reviewed = has reviewed_at OR status=completed, but NO completed_at
        const myReviewedCount = myData.filter(s => 
          (s.reviewed_at || s.status === 'completed') && !s.completed_at
        ).length;
        
        // Completed = has completed_at (report generated)
        const myCompletedCount = myData.filter(s => !!s.completed_at).length;

        setStats({
          orgTotalTests: orgTotalCount || 0,
          orgPendingTests: orgPendingCount || 0,
          orgReviewedTests: orgReviewedCount,
          orgCompletedTests: orgCompletedCount || 0,
          myTotalReviews,
          myInReviewCount,
          myReviewedCount,
          myCompletedCount,
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
