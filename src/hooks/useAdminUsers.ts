import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ParentWithChildren {
  parent_id: string;
  email: string | null;
  created_at: string | null;
  children: {
    id: string;
    name: string;
    age: number | null;
  }[];
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<ParentWithChildren[]> => {
      // First get all logopedist user IDs to exclude them
      const { data: logopedists, error: logopedistError } = await supabase
        .from('logopedist_profiles')
        .select('user_id');

      if (logopedistError) {
        console.error('Error fetching logopedists:', logopedistError);
        throw logopedistError;
      }

      const logopedistIds = logopedists?.map(l => l.user_id) || [];

      // Get all children with their parent info
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id, parent_id, name, age')
        .order('name');

      if (childrenError) {
        console.error('Error fetching children:', childrenError);
        throw childrenError;
      }

      // Filter out children whose parents are logopedists
      const filteredChildren = children?.filter(
        child => child.parent_id && !logopedistIds.includes(child.parent_id)
      ) || [];

      // Get unique parent IDs
      const parentIds = [...new Set(filteredChildren.map(c => c.parent_id))];

      // Get parent profiles from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', parentIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profile data
      }

      // Create a map of parent_id to profile info
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Group children by parent
      const parentMap = new Map<string, ParentWithChildren>();

      for (const child of filteredChildren) {
        if (!child.parent_id) continue;

        if (!parentMap.has(child.parent_id)) {
          const profile = profileMap.get(child.parent_id);
          parentMap.set(child.parent_id, {
            parent_id: child.parent_id,
            email: profile?.username || null,
            created_at: null, // We don't have access to auth.users.created_at directly
            children: [],
          });
        }

        parentMap.get(child.parent_id)?.children.push({
          id: child.id,
          name: child.name,
          age: child.age,
        });
      }

      return Array.from(parentMap.values());
    },
  });
}
