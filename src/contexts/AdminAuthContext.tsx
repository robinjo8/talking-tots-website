import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface LogopedistProfile {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  mfa_enabled: boolean;
  organization_name?: string;
  organization_type?: string;
}

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  profile: LogopedistProfile | null;
  isLoading: boolean;
  isLogopedist: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, organizationId: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<LogopedistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogopedistProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('logopedist_profiles')
        .select(`
          *,
          organizations (
            name,
            type
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('No logopedist profile found:', error.message);
        setProfile(null);
        return;
      }

      if (data) {
        setProfile({
          ...data,
          organization_name: data.organizations?.name,
          organization_type: data.organizations?.type,
        });
      }
    } catch (err) {
      console.error('Error fetching logopedist profile:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchLogopedistProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchLogopedistProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchLogopedistProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    organizationId: string
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      
      // Sign up with metadata - the database trigger will create the profile
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            organization_id: organizationId,
            is_logopedist: true,
          }
        }
      });

      if (error) return { error };

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isLogopedist = !!profile;

  return (
    <AdminAuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      isLogopedist,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
