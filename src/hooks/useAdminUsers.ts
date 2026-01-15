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
      // 1. Get all logopedist user IDs to exclude them
      const { data: logopedists, error: logopedistError } = await supabase
        .from('logopedist_profiles')
        .select('user_id');

      if (logopedistError) {
        console.error('Error fetching logopedists:', logopedistError);
        throw logopedistError;
      }

      const logopedistIds = new Set(logopedists?.map(l => l.user_id) || []);

      // 2. Get ALL profiles (not just those with children)
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // 3. Filter out logopedists
      const nonLogopedistProfiles = allProfiles?.filter(
        p => !logopedistIds.has(p.id)
      ) || [];

      if (nonLogopedistProfiles.length === 0) {
        return [];
      }

      // 4. Get emails from auth.users for profiles without username using RPC
      const profileIds = nonLogopedistProfiles.map(p => p.id);
      const profilesWithoutEmail = nonLogopedistProfiles
        .filter(p => !p.username)
        .map(p => p.id);

      let authEmailMap = new Map<string, string>();
      if (profilesWithoutEmail.length > 0) {
        const { data: authEmails, error: authEmailsError } = await supabase
          .rpc('get_parent_emails', { parent_ids: profilesWithoutEmail });
        
        if (authEmailsError) {
          console.error('Error fetching auth emails:', authEmailsError);
        } else if (authEmails) {
          authEmailMap = new Map(
            authEmails.map((e: { user_id: string; email: string }) => [e.user_id, e.email])
          );
        }
      }

      // 5. Get all children for these profiles
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id, parent_id, name, age, gender')
        .in('parent_id', profileIds)
        .order('name');

      if (childrenError) {
        console.error('Error fetching children:', childrenError);
        // Continue without children data - still show users
      }

      // 6. Group children by parent_id
      const childrenByParent = new Map<string, ChildData[]>();
      if (children) {
        for (const child of children) {
          if (!child.parent_id) continue;
          if (!childrenByParent.has(child.parent_id)) {
            childrenByParent.set(child.parent_id, []);
          }
          childrenByParent.get(child.parent_id)?.push({
            id: child.id,
            name: child.name,
            age: child.age,
            gender: child.gender,
          });
        }
      }

      // 7. Build the result - ALL users, including those without children
      const result: ParentWithChildren[] = nonLogopedistProfiles.map(profile => {
        // Use profile.username first, fallback to auth.users email
        const email = profile.username || authEmailMap.get(profile.id) || null;
        
        return {
          parent_id: profile.id,
          email: email,
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          created_at: profile.created_at || null,
          children: childrenByParent.get(profile.id) || [],
        };
      });

      return result;
    },
  });
}
