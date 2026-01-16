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

// Interface for auth user data returned from RPC
interface AuthUserData {
  user_id: string;
  email: string;
  display_name: string | null;
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

      // Helper function to check if string is in email format
      const isEmailFormat = (str: string | null): boolean => {
        if (!str) return false;
        return str.includes('@') && str.includes('.');
      };

      // 4. Get emails AND display_name from auth.users for ALL profiles using RPC
      const profileIds = nonLogopedistProfiles.map(p => p.id);

      let authEmailMap = new Map<string, string>();
      let authDisplayNameMap = new Map<string, string>();
      
      const { data: authEmails, error: authEmailsError } = await supabase
        .rpc('get_parent_emails', { parent_ids: profileIds });
      
      if (authEmailsError) {
        console.error('Error fetching auth emails:', authEmailsError);
      } else if (authEmails) {
        authEmailMap = new Map(
          authEmails.map((e: AuthUserData) => [e.user_id, e.email])
        );
        authDisplayNameMap = new Map(
          authEmails
            .filter((e: AuthUserData) => e.display_name)
            .map((e: AuthUserData) => [e.user_id, e.display_name!])
        );
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
        // EMAIL: Always from auth.users, fallback to username if it's email format
        const email = authEmailMap.get(profile.id) || 
                      (isEmailFormat(profile.username) ? profile.username : null);
        
        // NAME PRIORITY:
        // 1. first_name + last_name from profiles table
        // 2. username (if not email format)
        // 3. display_name from auth.users (Google OAuth full_name/name)
        let firstName = profile.first_name || null;
        let lastName = profile.last_name || null;
        
        if (!firstName && !lastName) {
          if (profile.username && !isEmailFormat(profile.username)) {
            // Use username if it's not an email
            const parts = profile.username.split(' ');
            firstName = parts[0] || null;
            lastName = parts.slice(1).join(' ') || null;
          } else {
            // Fallback to display_name from auth.users (Google OAuth)
            const displayName = authDisplayNameMap.get(profile.id);
            if (displayName) {
              const parts = displayName.split(' ');
              firstName = parts[0] || null;
              lastName = parts.slice(1).join(' ') || null;
            }
          }
        }
        
        return {
          parent_id: profile.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          created_at: profile.created_at || null,
          children: childrenByParent.get(profile.id) || [],
        };
      });

      return result;
    },
  });
}
