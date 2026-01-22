import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TestSessionData {
  id: string;
  status: 'pending' | 'assigned' | 'in_review' | 'completed';
  submitted_at: string | null;
  child_id: string;
  child_name: string;
  child_age: number | null;
  child_gender: string | null;
  parent_id: string;
  parent_first_name: string | null;
  parent_last_name: string | null;
  assigned_to: string | null;
}

export interface TestSessionStats {
  total: number;
  pending: number;
  inReview: number; // includes 'assigned' and 'in_review'
  completed: number;
}

export function useAdminTests() {
  return useQuery({
    queryKey: ['admin-tests'],
    queryFn: async (): Promise<TestSessionData[]> => {
      // 1. Get all test sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('articulation_test_sessions')
        .select('id, status, submitted_at, child_id, parent_id, assigned_to')
        .order('submitted_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching test sessions:', sessionsError);
        throw sessionsError;
      }

      if (!sessions || sessions.length === 0) {
        return [];
      }

      // 2. Get unique child IDs and parent IDs
      const childIds = [...new Set(sessions.map(s => s.child_id))];
      const parentIds = [...new Set(sessions.map(s => s.parent_id))];

      // 3. Fetch children data
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id, name, age, gender')
        .in('id', childIds);

      if (childrenError) {
        console.error('Error fetching children:', childrenError);
      }

      // 4. Fetch parent profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', parentIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // 5. Create lookup maps
      const childrenMap = new Map(
        (children || []).map(c => [c.id, c])
      );
      const profilesMap = new Map(
        (profiles || []).map(p => [p.id, p])
      );

      // 6. Build result
      const result: TestSessionData[] = sessions.map(session => {
        const child = childrenMap.get(session.child_id);
        const parent = profilesMap.get(session.parent_id);

        return {
          id: session.id,
          status: (session.status || 'pending') as TestSessionData['status'],
          submitted_at: session.submitted_at,
          child_id: session.child_id,
          child_name: child?.name || 'Neznano',
          child_age: child?.age || null,
          child_gender: child?.gender || null,
          parent_id: session.parent_id,
          parent_first_name: parent?.first_name || null,
          parent_last_name: parent?.last_name || null,
          assigned_to: session.assigned_to,
        };
      });

      return result;
    },
  });
}

export function calculateTestStats(sessions: TestSessionData[]): TestSessionStats {
  return {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    inReview: sessions.filter(s => s.status === 'assigned' || s.status === 'in_review').length,
    completed: sessions.filter(s => s.status === 'completed').length,
  };
}
