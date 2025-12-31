import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { addMonths, isBefore } from 'date-fns';

interface ArticulationTestStatus {
  lastCompletedAt: Date | null;
  nextTestDate: Date | null;
  isTestAvailable: boolean;
  isLoading: boolean;
}

export const useArticulationTestStatus = () => {
  const { selectedChild } = useAuth();
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
        const nextTestDate = addMonths(lastCompletedAt, 3);
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
  }, [selectedChild?.id]);

  useEffect(() => {
    fetchTestStatus();
  }, [fetchTestStatus]);

  const saveTestResult = async (): Promise<boolean> => {
    if (!selectedChild?.id) return false;

    try {
      const { error } = await supabase
        .from('articulation_test_results')
        .insert({
          child_id: selectedChild.id,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving articulation test result:', error);
        return false;
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
      const { error } = await supabase
        .from('articulation_test_results')
        .delete()
        .eq('child_id', selectedChild.id);

      if (error) {
        console.error('Error resetting articulation test:', error);
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
