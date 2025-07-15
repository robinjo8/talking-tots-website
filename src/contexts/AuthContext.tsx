
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ChildProfile = {
  id?: string;
  name: string;
  gender: string;
  avatarId: number;
  age?: number;
  birthDate?: Date | null;
  speechDifficulties?: string[];
  speechDifficultiesDescription?: string;
  speechDevelopment?: Record<string, string>;
  isComplete?: boolean;
};

export type Profile = {
  username: string | null;
  children?: ChildProfile[];
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  selectedChildIndex: number | null;
  setSelectedChildIndex: (index: number | null) => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(null);

  // Function to fetch user profile and children from user metadata (where registration stores data)
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Profile error:", profileError);
        throw profileError;
      }

      // Fetch user metadata from auth.users which contains child registration data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error fetching user metadata:', userError);
        setProfile({
          username: profileData?.username || null,
          children: []
        });
        return;
      }

      console.log('User metadata:', user.user_metadata);

      // Extract children data from user metadata (where registration stores it)
      const childrenFromMetadata = user.user_metadata?.children || [];
      
      // Transform children data to match ChildProfile interface
      const children: ChildProfile[] = childrenFromMetadata.map((child: any) => ({
        id: child.id || crypto.randomUUID(),
        name: child.name || '',
        gender: child.gender || 'M',
        avatarId: child.avatarId || 1,
        birthDate: child.birthDate ? new Date(child.birthDate) : null,
        speechDifficulties: child.speechDifficulties || [],
        speechDifficultiesDescription: child.speechDifficultiesDescription || '',
        speechDevelopment: child.speechDevelopment || {},
        isComplete: !!(child.speechDevelopment && Object.keys(child.speechDevelopment).length > 0)
      }));

      console.log('Profile loaded from metadata:', {
        username: profileData?.username,
        childrenCount: children.length,
        children: children
      });

      setProfile({
        username: profileData?.username || null,
        children
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Set a basic profile even if there's an error to prevent infinite loading
      setProfile({
        username: null,
        children: []
      });
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        
        // Check if there's a selectedChildIndex in localStorage during initialization
        const storedChildIndex = localStorage.getItem('selectedChildIndex');
        if (storedChildIndex && mounted) {
          setSelectedChildIndex(parseInt(storedChildIndex));
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setSelectedChildIndex(null);
        }
        
        setIsLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast.error("Napaka pri odjavi: " + error.message);
        return;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
      
      console.log("Sign out successful");
      toast.success("Uspešno ste se odjavili");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("Nepričakovana napaka pri odjavi");
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
    selectedChildIndex,
    setSelectedChildIndex,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth mora biti uporabljen znotraj AuthProvider");
  }
  return context;
};
