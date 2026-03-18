import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TestSessionData {
  id: string;
  status: 'pending' | 'assigned' | 'in_review' | 'completed';
  submitted_at: string | null;
  reviewed_at: string | null;
  completed_at: string | null;
  child_id: string;
  child_name: string;
  child_age: number | null;
  child_gender: string | null;
  parent_id: string;
  parent_first_name: string | null;
  parent_last_name: string | null;
  assigned_to: string | null;
  source_type: 'parent' | 'logopedist';
  logopedist_child_id: string | null;
  organization_id: string | null;
  organization_name: string | null;
  logopedist_first_name: string | null;
  logopedist_last_name: string | null;
  is_completed: boolean;
  word_count: number;
  session_number: number;
  total_words: number | null;
  additional_assignment_id: string | null;
}

export interface ChildGroup {
  childKey: string; // child_id or logopedist_child_id
  child_name: string;
  child_age: number | null;
  child_gender: string | null;
  parent_id: string;
  parent_first_name: string | null;
  parent_last_name: string | null;
  source_type: 'parent' | 'logopedist';
  organization_id: string | null;
  organization_name: string | null;
  logopedist_first_name: string | null;
  logopedist_last_name: string | null;
  sessions: TestSessionData[];
  latestSession: TestSessionData;
  completedSessionCount: number;
}

export interface TestSessionStats {
  total: number;
  pending: number;
  inReview: number;
  completed: number;
}

export interface TestSessionStatsExtended extends TestSessionStats {
  reviewed: number;
  notCompleted: number;
}

export function useAdminTests() {
  return useQuery({
    queryKey: ['admin-tests'],
    queryFn: async (): Promise<TestSessionData[]> => {
      // 1. Get all test sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('articulation_test_sessions')
        .select('id, status, submitted_at, reviewed_at, completed_at, child_id, parent_id, assigned_to, source_type, logopedist_child_id, organization_id, is_completed, session_number, total_words, additional_assignment_id')
        .order('submitted_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching test sessions:', sessionsError);
        throw sessionsError;
      }

      if (!sessions || sessions.length === 0) {
        return [];
      }

      // 2. Get unique IDs
      const parentChildIds = sessions
        .filter(s => s.source_type !== 'logopedist' && s.child_id)
        .map(s => s.child_id);
      const logopedistChildIds = sessions
        .filter(s => s.source_type === 'logopedist' && s.logopedist_child_id)
        .map(s => s.logopedist_child_id);
      const parentIds = [...new Set(sessions.map(s => s.parent_id))];
      const organizationIds = [...new Set(sessions.filter(s => s.organization_id).map(s => s.organization_id))];
      const sessionIds = sessions.map(s => s.id);

      // 3. Fetch all data in parallel (including word counts)
      const [childrenResult, logopedistChildrenResult, profilesResult, organizationsResult, wordCountsResult] = await Promise.all([
        parentChildIds.length > 0
          ? supabase.from('children').select('id, name, age, gender').in('id', parentChildIds)
          : Promise.resolve({ data: [], error: null }),
        logopedistChildIds.length > 0
          ? supabase.from('logopedist_children').select('id, name, age, gender, logopedist_id').in('id', logopedistChildIds)
          : Promise.resolve({ data: [], error: null }),
        parentIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name').in('id', parentIds)
          : Promise.resolve({ data: [], error: null }),
        organizationIds.length > 0
          ? supabase.from('organizations').select('id, name').in('id', organizationIds)
          : Promise.resolve({ data: [], error: null }),
        // Get word counts per session (select target_word for deduplication)
        sessionIds.length > 0
          ? supabase.from('articulation_word_results').select('session_id, target_word').in('session_id', sessionIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (childrenResult.error) console.error('Error fetching children:', childrenResult.error);
      if (logopedistChildrenResult.error) console.error('Error fetching logopedist children:', logopedistChildrenResult.error);
      if (profilesResult.error) console.error('Error fetching profiles:', profilesResult.error);
      if (organizationsResult.error) console.error('Error fetching organizations:', organizationsResult.error);
      if (wordCountsResult.error) console.error('Error fetching word counts:', wordCountsResult.error);

      // Count unique words per session (deduplicate by target_word to exclude repeats)
      const wordCountMap = new Map<string, number>();
      if (wordCountsResult.data) {
        const uniqueWordsPerSession = new Map<string, Set<string>>();
        for (const row of wordCountsResult.data) {
          if (!uniqueWordsPerSession.has(row.session_id)) {
            uniqueWordsPerSession.set(row.session_id, new Set());
          }
          uniqueWordsPerSession.get(row.session_id)!.add(row.target_word);
        }
        for (const [sessionId, words] of uniqueWordsPerSession) {
          wordCountMap.set(sessionId, words.size);
        }
      }

      // 4. Get logopedist profiles
      const logopedistIds = [...new Set(
        (logopedistChildrenResult.data || [])
          .map(c => c.logopedist_id)
          .filter(Boolean)
      )];

      const logopedistProfilesResult = logopedistIds.length > 0
        ? await supabase.from('logopedist_profiles').select('id, first_name, last_name').in('id', logopedistIds)
        : { data: [], error: null };

      if (logopedistProfilesResult.error) console.error('Error fetching logopedist profiles:', logopedistProfilesResult.error);

      // 5. Create lookup maps
      const childrenMap = new Map((childrenResult.data || []).map(c => [c.id, c]));
      const logopedistChildrenMap = new Map((logopedistChildrenResult.data || []).map(c => [c.id, c]));
      const profilesMap = new Map((profilesResult.data || []).map(p => [p.id, p]));
      const organizationsMap = new Map((organizationsResult.data || []).map(o => [o.id, o]));
      const logopedistProfilesMap = new Map((logopedistProfilesResult.data || []).map(lp => [lp.id, lp]));

      // 6. Build result — filter out abandoned empty sessions
      const allSessions: TestSessionData[] = sessions.map(session => {
        let childData: { name: string; age: number | null; gender: string | null; logopedist_id?: string } | undefined;
        let logopedistProfile: { first_name: string; last_name: string } | undefined;

        if (session.source_type === 'logopedist' && session.logopedist_child_id) {
          childData = logopedistChildrenMap.get(session.logopedist_child_id);
          if (childData?.logopedist_id) {
            logopedistProfile = logopedistProfilesMap.get(childData.logopedist_id);
          }
        } else if (session.child_id) {
          childData = childrenMap.get(session.child_id);
        }

        const parent = profilesMap.get(session.parent_id);
        const organization = session.organization_id ? organizationsMap.get(session.organization_id) : null;
        const wordCount = wordCountMap.get(session.id) || 0;

        return {
          id: session.id,
          status: (session.status || 'pending') as TestSessionData['status'],
          submitted_at: session.submitted_at,
          reviewed_at: session.reviewed_at,
          completed_at: session.completed_at,
          child_id: session.child_id,
          child_name: childData?.name || 'Neznano',
          child_age: childData?.age || null,
          child_gender: childData?.gender || null,
          parent_id: session.parent_id,
          parent_first_name: parent?.first_name || null,
          parent_last_name: parent?.last_name || null,
          assigned_to: session.assigned_to,
          source_type: (session.source_type || 'parent') as 'parent' | 'logopedist',
          logopedist_child_id: session.logopedist_child_id,
          organization_id: session.organization_id,
          organization_name: organization?.name || null,
          logopedist_first_name: logopedistProfile?.first_name || null,
          logopedist_last_name: logopedistProfile?.last_name || null,
          is_completed: session.is_completed ?? false,
          word_count: wordCount,
          session_number: session.session_number ?? 1,
          total_words: session.total_words ?? null,
        };
      });

      // Filter out truly abandoned empty sessions (pending, not completed, no words)
      return allSessions.filter(s => {
        if (s.is_completed) return true;
        if (s.word_count > 0) return true;
        if (s.status !== 'pending') return true;
        return false;
      });
    },
  });
}

export function groupSessionsByChild(sessions: TestSessionData[]): ChildGroup[] {
  const groupMap = new Map<string, TestSessionData[]>();

  for (const session of sessions) {
    const key = session.source_type === 'logopedist'
      ? (session.logopedist_child_id || session.child_id)
      : session.child_id;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(session);
  }

  const groups: ChildGroup[] = [];
  for (const [childKey, childSessions] of groupMap) {
    // Sort sessions by submitted_at desc (latest first)
    childSessions.sort((a, b) => {
      const dateA = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
      const dateB = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
      return dateB - dateA;
    });

    const latest = childSessions[0];
    groups.push({
      childKey,
      child_name: latest.child_name,
      child_age: latest.child_age,
      child_gender: latest.child_gender,
      parent_id: latest.parent_id,
      parent_first_name: latest.parent_first_name,
      parent_last_name: latest.parent_last_name,
      source_type: latest.source_type,
      organization_id: latest.organization_id,
      organization_name: latest.organization_name,
      logopedist_first_name: latest.logopedist_first_name,
      logopedist_last_name: latest.logopedist_last_name,
      sessions: childSessions,
      latestSession: latest,
      completedSessionCount: childSessions.filter(s => s.is_completed).length,
    });
  }

  // Sort groups by latest session date (newest first)
  groups.sort((a, b) => {
    const dateA = a.latestSession.submitted_at ? new Date(a.latestSession.submitted_at).getTime() : 0;
    const dateB = b.latestSession.submitted_at ? new Date(b.latestSession.submitted_at).getTime() : 0;
    return dateB - dateA;
  });

  return groups;
}

export function calculateTestStats(sessions: TestSessionData[]): TestSessionStatsExtended {
  const completedSessions = sessions.filter(s => s.is_completed);
  return {
    total: sessions.length,
    notCompleted: sessions.filter(s => !s.is_completed).length,
    pending: completedSessions.filter(s => s.status === 'pending').length,
    inReview: completedSessions.filter(s => s.status === 'assigned' || s.status === 'in_review').length,
    reviewed: completedSessions.filter(s => s.status === 'completed' && !s.completed_at).length,
    completed: completedSessions.filter(s => !!s.completed_at).length,
  };
}
