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
  // Fields for organization filtering
  source_type: 'parent' | 'logopedist';
  logopedist_child_id: string | null;
  organization_id: string | null;
  // Fields for source display
  organization_name: string | null;
  logopedist_first_name: string | null;
  logopedist_last_name: string | null;
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
        .select('id, status, submitted_at, reviewed_at, completed_at, child_id, parent_id, assigned_to, source_type, logopedist_child_id, organization_id')
        .order('submitted_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching test sessions:', sessionsError);
        throw sessionsError;
      }

      if (!sessions || sessions.length === 0) {
        return [];
      }

      // 2. Get unique IDs for both parent and logopedist children
      const parentChildIds = sessions
        .filter(s => s.source_type !== 'logopedist' && s.child_id)
        .map(s => s.child_id);
      const logopedistChildIds = sessions
        .filter(s => s.source_type === 'logopedist' && s.logopedist_child_id)
        .map(s => s.logopedist_child_id);
      const parentIds = [...new Set(sessions.map(s => s.parent_id))];
      const organizationIds = [...new Set(sessions.filter(s => s.organization_id).map(s => s.organization_id))];

      // 3. Fetch all data in parallel
      const [childrenResult, logopedistChildrenResult, profilesResult, organizationsResult] = await Promise.all([
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
      ]);

      if (childrenResult.error) {
        console.error('Error fetching children:', childrenResult.error);
      }
      if (logopedistChildrenResult.error) {
        console.error('Error fetching logopedist children:', logopedistChildrenResult.error);
      }
      if (profilesResult.error) {
        console.error('Error fetching profiles:', profilesResult.error);
      }
      if (organizationsResult.error) {
        console.error('Error fetching organizations:', organizationsResult.error);
      }

      // 4. Get logopedist IDs from logopedist_children to fetch their names
      const logopedistIds = [...new Set(
        (logopedistChildrenResult.data || [])
          .map(c => c.logopedist_id)
          .filter(Boolean)
      )];

      const logopedistProfilesResult = logopedistIds.length > 0
        ? await supabase.from('logopedist_profiles').select('id, first_name, last_name').in('id', logopedistIds)
        : { data: [], error: null };

      if (logopedistProfilesResult.error) {
        console.error('Error fetching logopedist profiles:', logopedistProfilesResult.error);
      }

      // 5. Create lookup maps
      const childrenMap = new Map(
        (childrenResult.data || []).map(c => [c.id, c])
      );
      const logopedistChildrenMap = new Map(
        (logopedistChildrenResult.data || []).map(c => [c.id, c])
      );
      const profilesMap = new Map(
        (profilesResult.data || []).map(p => [p.id, p])
      );
      const organizationsMap = new Map(
        (organizationsResult.data || []).map(o => [o.id, o])
      );
      const logopedistProfilesMap = new Map(
        (logopedistProfilesResult.data || []).map(lp => [lp.id, lp])
      );

      // 6. Build result
      const result: TestSessionData[] = sessions.map(session => {
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
        };
      });

      return result;
    },
  });
}

export interface TestSessionStatsExtended extends TestSessionStats {
  reviewed: number;
}

export function calculateTestStats(sessions: TestSessionData[]): TestSessionStatsExtended {
  return {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    inReview: sessions.filter(s => s.status === 'assigned' || s.status === 'in_review').length,
    reviewed: sessions.filter(s => s.status === 'completed' && !s.completed_at).length,
    completed: sessions.filter(s => !!s.completed_at).length,
  };
}
