// AdminAuthContext - handles logopedist authentication
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
  isSuperAdmin: boolean;
  mfaVerified: boolean;
  setMfaVerified: (verified: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, organizationId: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const MFA_SESSION_KEY = 'tomitalk_mfa_verified';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<LogopedistProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mfaVerified, setMfaVerifiedState] = useState<boolean>(() => {
    return sessionStorage.getItem(MFA_SESSION_KEY) === 'true';
  });

  const setMfaVerified = (verified: boolean) => {
    setMfaVerifiedState(verified);
    if (verified) {
      sessionStorage.setItem(MFA_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(MFA_SESSION_KEY);
    }
  };

  const fetchLogopedistProfile = async (userId: string) => {
    setIsProfileLoading(true);
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

        // Check if user is super admin
        const { data: adminPerm } = await supabase
          .from('admin_permissions')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'super_admin')
          .eq('is_active', true)
          .maybeSingle();

        setIsSuperAdmin(!!adminPerm);
      }
    } catch (err) {
      console.error('Error fetching logopedist profile:', err);
      setProfile(null);
      setIsSuperAdmin(false);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchLogopedistProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isSigningOut) {
          console.log('AdminAuthContext: Ignoring auth event during signout:', event);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchLogopedistProfile(session.user.id);
        } else {
          setProfile(null);
          setIsProfileLoading(false);
        }
        setIsAuthLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchLogopedistProfile(session.user.id);
      } else {
        setIsProfileLoading(false);
      }
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      const { error } = await supabase.auth.signUp({
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
      return { error: error || null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const isLogopedist = !!profile;
  const isLoading = isAuthLoading || isProfileLoading;

  const signOut = async () => {
    setIsSigningOut(true);
    localStorage.removeItem('sb-ecmtctwovkheohqwahvt-auth-token');
    // Clear MFA state on sign out
    setMfaVerified(false);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('SignOut error (ignored):', error);
    }
    
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsSuperAdmin(false);
    setIsProfileLoading(false);
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      isLogopedist,
      isSuperAdmin,
      mfaVerified,
      setMfaVerified,
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
