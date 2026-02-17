import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SessionInfo {
  sessionId: string;
  sessionNumber: number;
  startIndex: number;        // Naslednja beseda za izgovorjavo (current_word_index + 1)
  lastSpokenIndex: number;   // Zadnja uspešno izgovorjena beseda (za prikaz v dialogu)
  isResume: boolean;
  totalWords: number;
}

interface UseUserSessionManagerResult {
  sessionInfo: SessionInfo | null;
  isInitializing: boolean;
  initializeSession: (childId: string, totalWords?: number) => Promise<SessionInfo | null>;
  updateProgress: (wordIndex: number) => Promise<void>;
  completeSession: () => Promise<void>;
}

/**
 * Hook for managing articulation test sessions for parent-managed children (user portal).
 * 
 * Key features:
 * - Uses child_id (NOT logopedist_child_id) for strict data separation
 * - Uses source_type: 'parent' to differentiate from logopedist sessions
 * - Creates new sessions or resumes incomplete ones from the database
 * - Tracks progress (current_word_index) in the database, not localStorage
 * - Marks sessions as completed (is_completed = true) when all words are done
 */
export const useUserSessionManager = (): UseUserSessionManagerResult => {
  const { user } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Initialize or resume a session for a child.
   * 
   * Logic:
   * 1. Check if there's an incomplete session (is_completed = false) for this child_id
   * 2. If yes, resume it from current_word_index
   * 3. If no, create a new session with the next session_number
   */
  const initializeSession = useCallback(async (
    childId: string,
    totalWords: number = 60
  ): Promise<SessionInfo | null> => {
    if (!user) {
      console.error('No user available');
      return null;
    }

    setIsInitializing(true);

    try {
      // 1. Check for an existing incomplete session using child_id (NOT logopedist_child_id)
      const { data: existingSession, error: fetchError } = await supabase
        .from('articulation_test_sessions')
        .select('id, session_number, current_word_index, total_words')
        .eq('child_id', childId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing session:', fetchError);
      }

      if (existingSession) {
        // Resume the existing session
        // current_word_index pomeni "zadnja uspešno izgovorjena beseda"
        // startIndex = current_word_index + 1 (naslednja beseda za izgovorjavo)
        console.log('Resuming existing user session:', existingSession);
        const lastSpoken = existingSession.current_word_index ?? 0;
        const info: SessionInfo = {
          sessionId: existingSession.id,
          sessionNumber: existingSession.session_number ?? 1,
          startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0,
          lastSpokenIndex: lastSpoken,
          isResume: lastSpoken > 0,
          totalWords: existingSession.total_words ?? totalWords,
        };
        setSessionInfo(info);
        return info;
      }

      // 2. No incomplete session - determine the next session number
      const { data: completedSessions, error: countError } = await supabase
        .from('articulation_test_sessions')
        .select('session_number')
        .eq('child_id', childId)
        .eq('is_completed', true)
        .order('session_number', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error counting completed sessions:', countError);
      }

      const lastSessionNumber = completedSessions?.[0]?.session_number ?? 0;
      const nextSessionNumber = lastSessionNumber + 1;

      console.log('Creating new user session:', nextSessionNumber);

      // 3. Create a new session with child_id and source_type: 'parent'
      const insertData: {
        parent_id: string;
        child_id: string;
        source_type: string;
        session_number: number;
        current_word_index: number;
        total_words: number;
        is_completed: boolean;
        status: 'pending' | 'assigned' | 'in_review' | 'completed';
      } = {
        parent_id: user.id,
        child_id: childId,
        source_type: 'parent',
        session_number: nextSessionNumber,
        current_word_index: 0,
        total_words: totalWords,
        is_completed: false,
        status: 'pending',
      };

      const { data: newSession, error: insertError } = await supabase
        .from('articulation_test_sessions')
        .insert(insertData)
        .select('id, session_number, current_word_index, total_words')
        .single();

      if (insertError) {
        console.error('Error creating new session:', insertError);
        return null;
      }

      const info: SessionInfo = {
        sessionId: newSession.id,
        sessionNumber: newSession.session_number ?? nextSessionNumber,
        startIndex: 0,
        lastSpokenIndex: -1,  // Nobena beseda še ni bila izgovorjena
        isResume: false,
        totalWords: newSession.total_words ?? totalWords,
      };
      setSessionInfo(info);
      return info;

    } catch (err) {
      console.error('Error in initializeSession:', err);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [user]);

  /**
   * Update the current word index in the database.
   * Called after each successful recording.
   */
  const updateProgress = useCallback(async (wordIndex: number): Promise<void> => {
    if (!sessionInfo) {
      console.error('No session to update');
      return;
    }

    try {
      const { error } = await supabase
        .from('articulation_test_sessions')
        .update({ current_word_index: wordIndex })
        .eq('id', sessionInfo.sessionId);

      if (error) {
        console.error('Error updating progress:', error);
      } else {
        console.log('Progress updated to word index:', wordIndex);
      }
    } catch (err) {
      console.error('Error in updateProgress:', err);
    }
  }, [sessionInfo]);

  /**
   * Mark the session as completed.
   * Called when the last word is recorded.
   */
  const completeSession = useCallback(async (): Promise<void> => {
    if (!sessionInfo) {
      console.error('No session to complete');
      return;
    }

    try {
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

      const { error } = await supabase
        .from('articulation_test_sessions')
        .update(updateData)
        .eq('id', sessionInfo.sessionId);

      if (error) {
        console.error('Error completing session:', error);
      } else {
        console.log('Session completed:', sessionInfo.sessionId);
      }
    } catch (err) {
      console.error('Error in completeSession:', err);
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
