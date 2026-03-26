import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { addMonths, addDays, isBefore } from 'date-fns';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

/**
 * Calculate smart cooldown: normally 90 days, but shortened if needed
 * to ensure a test happens 7 days before subscription end.
 * Minimum cooldown: 30 days.
 */
function calculateNextTestDate(lastCompletedAt: Date, subscriptionEnd: string | null): Date {
  const normalNext = addMonths(lastCompletedAt, 3);
  
  if (!subscriptionEnd) return normalNext;
  
  const subEnd = new Date(subscriptionEnd);
  const lastTestTarget = addDays(subEnd, -7); // 7 days before expiry
  
  if (isBefore(lastTestTarget, normalNext)) {
    // Normal cooldown overshoots — check minimum 30 days
    const minNext = addDays(lastCompletedAt, 30);
    if (isBefore(lastTestTarget, minNext)) {
      // Even shortened cooldown would be < 30 days, use minimum
      return minNext;
    }
    return lastTestTarget;
  }
  
  return normalNext;
}

interface ArticulationTestStatus {
  lastCompletedAt: Date | null;
  nextTestDate: Date | null;
  isTestAvailable: boolean;
  isLoading: boolean;
}

export const useArticulationTestStatus = () => {
  const { selectedChild } = useAuth();
  const { subscriptionEnd, isPro } = useSubscriptionContext();
  const [status, setStatus] = useState<ArticulationTestStatus>({
    lastCompletedAt: null,
    nextTestDate: null,
    isTestAvailable: true,
    isLoading: true,
  });

  const fetchTestStatus = useCallback(async () => {
    if (!selectedChild?.id) {
      setStatus({
        lastCompletedAt: null,
        nextTestDate: null,
        isTestAvailable: true,
        isLoading: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('articulation_test_results')
        .select('completed_at')
        .eq('child_id', selectedChild.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching articulation test status:', error);
        setStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (data) {
        const lastCompletedAt = new Date(data.completed_at);
        // Smart cooldown: use subscriptionEnd for Pro users
        const nextTestDate = isPro
          ? calculateNextTestDate(lastCompletedAt, subscriptionEnd)
          : addMonths(lastCompletedAt, 3);
        const isTestAvailable = isBefore(nextTestDate, new Date());

        setStatus({
          lastCompletedAt,
          nextTestDate,
          isTestAvailable,
          isLoading: false,
        });
      } else {
        // No test completed yet
        setStatus({
          lastCompletedAt: null,
          nextTestDate: null,
          isTestAvailable: true,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('Error in fetchTestStatus:', err);
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, [selectedChild?.id, subscriptionEnd, isPro]);

  useEffect(() => {
    fetchTestStatus();
  }, [fetchTestStatus]);

  const saveTestResult = async (): Promise<boolean> => {
    if (!selectedChild?.id) return false;

    try {
      // Get current user for parent_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      // 1. Save to articulation_test_results (for internal tracking)
      const { error: resultError } = await supabase
        .from('articulation_test_results')
        .insert({
          child_id: selectedChild.id,
          completed_at: new Date().toISOString(),
        });

      if (resultError) {
        console.error('Error saving articulation test result:', resultError);
        return false;
      }

      // 2. Also create a session for the admin portal
      const { error: sessionError } = await supabase
        .from('articulation_test_sessions')
        .insert({
          child_id: selectedChild.id,
          parent_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        });

      if (sessionError) {
        console.error('Error creating articulation test session:', sessionError);
        // Don't return false here - the result was saved, session is for admin portal
      }

      // Refresh status after saving
      await fetchTestStatus();
      return true;
    } catch (err) {
      console.error('Error in saveTestResult:', err);
      return false;
    }
  };

  const resetTest = async (): Promise<boolean> => {
    if (!selectedChild?.id) return false;

    try {
      const response = await supabase.functions.invoke("reset-articulation-test", {
        body: { childId: selectedChild.id },
      });

      if (response.error) {
        console.error('Error resetting articulation test:', response.error);
        return false;
      }

      // Refresh status after reset
      await fetchTestStatus();
      return true;
    } catch (err) {
      console.error('Error in resetTest:', err);
      return false;
    }
  };

  return {
    ...status,
    saveTestResult,
    resetTest,
    refetch: fetchTestStatus,
  };
};
