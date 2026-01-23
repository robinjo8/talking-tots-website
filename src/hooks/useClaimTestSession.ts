import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface ClaimSessionResult {
  success: boolean;
  error?: string;
}

export function useClaimTestSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAdminAuth();
  const queryClient = useQueryClient();

  const claimSession = async (sessionId: string): Promise<ClaimSessionResult> => {
    if (!profile?.id) {
      return { success: false, error: 'Niste prijavljeni kot logoped' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('articulation_test_sessions')
        .update({
          assigned_to: profile.id,
          assigned_at: new Date().toISOString(),
          status: 'in_review',
        })
        .eq('id', sessionId)
        .eq('status', 'pending')
        .is('assigned_to', null);

      if (updateError) {
        console.error('Error claiming session:', updateError);
        setError('Napaka pri prevzemu seje');
        return { success: false, error: updateError.message };
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-pending-tests'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-my-reviews'] });

      return { success: true };
    } catch (err) {
      console.error('Error in claimSession:', err);
      const errorMessage = 'Nepričakovana napaka pri prevzemu';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimSession,
    isLoading,
    error,
  };
}
