import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChildData {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
}

export interface ParentWithChildren {
  parent_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  children: ChildData[];
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

      // Get all children with their parent info including gender
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id, parent_id, name, age, gender')
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

      // Get parent profiles from profiles table with first_name and last_name
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name')
        .in('id', parentIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profile data
      }

      // Create a map of parent_id to profile info
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Find parents without username (email) in profiles
      const parentsWithoutEmail = parentIds.filter(pid => {
        const profile = profileMap.get(pid);
        return !profile?.username;
      });

      // Get emails from auth.users for parents without username using RPC
      let authEmailMap = new Map<string, string>();
      if (parentsWithoutEmail.length > 0) {
        const { data: authEmails, error: authEmailsError } = await supabase
          .rpc('get_parent_emails', { parent_ids: parentsWithoutEmail });
        
        if (authEmailsError) {
          console.error('Error fetching auth emails:', authEmailsError);
        } else if (authEmails) {
          authEmailMap = new Map(authEmails.map((e: { user_id: string; email: string }) => [e.user_id, e.email]));
        }
      }

      // Group children by parent
      const parentMap = new Map<string, ParentWithChildren>();

      for (const child of filteredChildren) {
        if (!child.parent_id) continue;

        if (!parentMap.has(child.parent_id)) {
          const profile = profileMap.get(child.parent_id);
          // Use profile.username first, fallback to auth.users email
          const email = profile?.username || authEmailMap.get(child.parent_id) || null;
          
          parentMap.set(child.parent_id, {
            parent_id: child.parent_id,
            email: email,
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            created_at: null,
            children: [],
          });
        }

        parentMap.get(child.parent_id)?.children.push({
          id: child.id,
          name: child.name,
          age: child.age,
          gender: child.gender,
        });
      }

      return Array.from(parentMap.values());
    },
  });
}
