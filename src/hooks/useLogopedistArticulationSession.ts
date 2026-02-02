import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from 'sonner';

interface SaveSessionResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

/**
 * Hook for saving articulation test sessions for logopedist-managed children.
 * Creates sessions with organization_id and logopedist_child_id for proper
 * isolation and filtering in the pending queue.
 */
export const useLogopedistArticulationSession = () => {
  const { profile, user } = useAdminAuth();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Save completed articulation test session for a logopedist-managed child.
   * Creates entry in articulation_test_sessions with:
   * - logopedist_child_id: the child ID from logopedist_children table
   * - organization_id: the logopedist's organization
   * - source_type: 'logopedist'
   * - status: 'pending' (for other logopedists in org to claim)
   */
  const saveSession = useCallback(async (
    logopedistChildId: string,
    sessionNumber: number
  ): Promise<SaveSessionResult> => {
    if (!profile || !user) {
      return { success: false, error: 'Ni prijavljenega logopeda' };
    }

    setIsSaving(true);

    try {
      // Get the logopedist profile ID for parent_id field
      // (we use parent_id as a generic "creator" field)
      const { data: sessionData, error: sessionError } = await supabase
        .from('articulation_test_sessions')
        .insert({
          // child_id is now nullable - we set it to null for logopedist sessions
          // The actual child reference is stored in logopedist_child_id
          child_id: null,
          parent_id: user.id,
          logopedist_child_id: logopedistChildId,
          organization_id: profile.organization_id,
          source_type: 'logopedist',
          status: 'pending',
          session_number: sessionNumber,
          submitted_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Error creating articulation test session:', sessionError);
        return { success: false, error: sessionError.message };
      }

      console.log('Created articulation test session:', sessionData.id);
      
      return { success: true, sessionId: sessionData.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Neznana napaka';
      console.error('Error in saveSession:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [profile, user]);

  return {
    saveSession,
    isSaving,
  };
};
