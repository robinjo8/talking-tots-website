import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdditionalSessionInfo {
  sessionId: string;
  sessionNumber: number;
  startIndex: number;
  lastSpokenIndex: number;
  isResume: boolean;
  totalWords: number;
  assignmentId: string;
}

/**
 * Session manager for additional test assignments.
 * Similar to useUserSessionManager but links to additional_assignment_id.
 */
export const useAdditionalTestSession = () => {
  const { user } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<AdditionalSessionInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeSession = useCallback(async (
    childId: string,
    assignmentId: string,
    totalWords: number
  ): Promise<AdditionalSessionInfo | null> => {
    if (!user) return null;
    setIsInitializing(true);

    try {
      // Check for existing incomplete session for this assignment
      const { data: existingSession, error: fetchError } = await supabase
        .from('articulation_test_sessions')
        .select('id, session_number, current_word_index, total_words')
        .eq('child_id', childId)
        .eq('additional_assignment_id', assignmentId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing additional session:', fetchError);
      }

      if (existingSession) {
        const lastSpoken = existingSession.current_word_index ?? 0;
        const info: AdditionalSessionInfo = {
          sessionId: existingSession.id,
          sessionNumber: existingSession.session_number ?? 1,
          startIndex: lastSpoken,
          lastSpokenIndex: lastSpoken > 0 ? lastSpoken - 1 : -1,
          isResume: lastSpoken > 0,
          totalWords: existingSession.total_words ?? totalWords,
          assignmentId,
        };
        setSessionInfo(info);

        // Update assignment status to in_progress
        await supabase
          .from('additional_test_assignments')
          .update({ status: 'in_progress' })
          .eq('id', assignmentId);

        return info;
      }

      // Create new session
      const insertData: {
        parent_id: string;
        child_id: string;
        source_type: string;
        session_number: number;
        current_word_index: number;
        total_words: number;
        is_completed: boolean;
        status: 'pending' | 'assigned' | 'in_review' | 'completed';
        additional_assignment_id: string;
      } = {
        parent_id: user.id,
        child_id: childId,
        source_type: 'parent',
        session_number: 1,
        current_word_index: 0,
        total_words: totalWords,
        is_completed: false,
        status: 'pending',
        additional_assignment_id: assignmentId,
      };

      const { data: newSession, error: insertError } = await supabase
        .from('articulation_test_sessions')
        .insert(insertData)
        .select('id, session_number, current_word_index, total_words')
        .single();

      if (insertError) {
        console.error('Error creating additional session:', insertError);
        return null;
      }

      // Update assignment status and session_id
      await supabase
        .from('additional_test_assignments')
        .update({ status: 'in_progress', session_id: newSession.id })
        .eq('id', assignmentId);

      const info: AdditionalSessionInfo = {
        sessionId: newSession.id,
        sessionNumber: 1,
        startIndex: 0,
        lastSpokenIndex: -1,
        isResume: false,
        totalWords,
        assignmentId,
      };
      setSessionInfo(info);
      return info;

    } catch (err) {
      console.error('Error in initializeAdditionalSession:', err);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [user]);

  const updateProgress = useCallback(async (wordIndex: number): Promise<void> => {
    if (!sessionInfo) return;
    const { error } = await supabase
      .from('articulation_test_sessions')
      .update({ current_word_index: wordIndex })
      .eq('id', sessionInfo.sessionId);
    if (error) console.error('Error updating additional progress:', error);
  }, [sessionInfo]);

  const completeSession = useCallback(async (): Promise<void> => {
    if (!sessionInfo) return;

    try {
      // Mark session as completed
      const updateData: {
        is_completed: boolean;
        status: 'pending' | 'assigned' | 'in_review' | 'completed';
        current_word_index: number;
        completed_at: string;
        submitted_at: string;
      } = {
        is_completed: true,
        status: 'pending',
        current_word_index: sessionInfo.totalWords,
        completed_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      };

      await supabase
        .from('articulation_test_sessions')
        .update(updateData)
        .eq('id', sessionInfo.sessionId);

      // Mark assignment as completed
      await supabase
        .from('additional_test_assignments')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', sessionInfo.assignmentId);

      // Create notification for the logopedist
      const { data: assignment } = await supabase
        .from('additional_test_assignments')
        .select('assigned_by')
        .eq('id', sessionInfo.assignmentId)
        .single();

      if (assignment) {
        const { data: logopedist } = await supabase
          .from('logopedist_profiles')
          .select('user_id, organization_id')
          .eq('id', assignment.assigned_by)
          .single();

        if (logopedist) {
          const { data: child } = await supabase
            .from('children')
            .select('name, age')
            .eq('id', sessionInfo.sessionId ? '' : '')
            .single();

          // Get child info from the session
          const { data: sessionData } = await supabase
            .from('articulation_test_sessions')
            .select('child_id')
            .eq('id', sessionInfo.sessionId)
            .single();

          let childName = 'Otrok';
          if (sessionData?.child_id) {
            const { data: childData } = await supabase
              .from('children')
              .select('name')
              .eq('id', sessionData.child_id)
              .single();
            if (childData) childName = childData.name;
          }

          await supabase.from('notifications').insert({
            type: 'additional_test_completed' as any,
            title: 'Dodatno preverjanje zaključeno',
            message: `${childName} je opravil/a dodatno preverjanje izgovorjave`,
            link: '/admin/pending',
            recipient_id: logopedist.user_id,
            organization_id: logopedist.organization_id,
            related_session_id: sessionInfo.sessionId,
          });
        }
      }

      console.log('Additional session completed:', sessionInfo.sessionId);
    } catch (err) {
      console.error('Error completing additional session:', err);
    }
  }, [sessionInfo]);

  return {
    sessionInfo,
    isInitializing,
    initializeSession,
    updateProgress,
    completeSession,
  };
};
