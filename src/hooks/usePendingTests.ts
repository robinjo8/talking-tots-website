import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export interface PendingTestSession {
  id: string;
  status: 'pending';
  submitted_at: string | null;
  child_id: string;
  child_name: string;
  child_age: number | null;
  child_gender: string | null;
  parent_id: string;
  parent_first_name: string | null;
  parent_last_name: string | null;
  // New fields for logopedist children
  source_type: 'parent' | 'logopedist';
  logopedist_child_id: string | null;
  organization_id: string | null;
}

export function usePendingTests() {
  const { profile } = useAdminAuth();

  return useQuery({
    queryKey: ['admin-pending-tests', profile?.organization_id, profile?.organization_type],
    queryFn: async (): Promise<PendingTestSession[]> => {
      if (!profile) {
        return [];
      }

      const isInternal = profile.organization_type === 'internal';

      // Build query based on organization type
      let query = supabase
        .from('articulation_test_sessions')
        .select('id, status, submitted_at, child_id, parent_id, source_type, logopedist_child_id, organization_id')
        .eq('status', 'pending')
        .is('assigned_to', null)
        .order('submitted_at', { ascending: true });

      if (isInternal) {
        // Internal (TomiTalk) logopedists see sessions from parent submissions
        query = query.eq('source_type', 'parent');
      } else {
        // External organization logopedists see only their organization's sessions
        query = query
          .eq('source_type', 'logopedist')
          .eq('organization_id', profile.organization_id);
      }

      const { data: sessions, error: sessionsError } = await query;

      if (sessionsError) {
        console.error('Error fetching pending sessions:', sessionsError);
        throw sessionsError;
      }

      if (!sessions || sessions.length === 0) {
        return [];
      }

      // Separate child IDs based on source type
      const parentChildIds = sessions
        .filter(s => s.source_type === 'parent' && s.child_id)
        .map(s => s.child_id);
      const logopedistChildIds = sessions
        .filter(s => s.source_type === 'logopedist' && s.logopedist_child_id)
        .map(s => s.logopedist_child_id);
      const parentIds = [...new Set(sessions.filter(s => s.parent_id).map(s => s.parent_id))];

      // Fetch children data from both tables in parallel
      const [childrenResult, logopedistChildrenResult, profilesResult] = await Promise.all([
        parentChildIds.length > 0
          ? supabase.from('children').select('id, name, age, gender').in('id', parentChildIds)
          : Promise.resolve({ data: [], error: null }),
        logopedistChildIds.length > 0
          ? supabase.from('logopedist_children').select('id, name, age, gender').in('id', logopedistChildIds)
          : Promise.resolve({ data: [], error: null }),
        parentIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name').in('id', parentIds)
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

      // Create lookup maps
      const childrenMap = new Map(
        (childrenResult.data || []).map(c => [c.id, c])
      );
      const logopedistChildrenMap = new Map(
        (logopedistChildrenResult.data || []).map(c => [c.id, c])
      );
      const profilesMap = new Map(
        (profilesResult.data || []).map(p => [p.id, p])
      );

      // Build result
      const result: PendingTestSession[] = sessions.map(session => {
        let childData: { name: string; age: number | null; gender: string | null } | undefined;
        
        if (session.source_type === 'logopedist' && session.logopedist_child_id) {
          childData = logopedistChildrenMap.get(session.logopedist_child_id);
        } else if (session.child_id) {
          childData = childrenMap.get(session.child_id);
        }

        const parent = session.parent_id ? profilesMap.get(session.parent_id) : null;

        return {
          id: session.id,
          status: 'pending' as const,
          submitted_at: session.submitted_at,
          child_id: session.child_id,
          child_name: childData?.name || 'Neznano',
          child_age: childData?.age || null,
          child_gender: childData?.gender || null,
          parent_id: session.parent_id,
          parent_first_name: parent?.first_name || null,
          parent_last_name: parent?.last_name || null,
          source_type: (session.source_type || 'parent') as 'parent' | 'logopedist',
          logopedist_child_id: session.logopedist_child_id,
          organization_id: session.organization_id,
        };
      });

      return result;
    },
    enabled: !!profile,
  });
}
