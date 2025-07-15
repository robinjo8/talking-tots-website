
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

  // Function to fetch user profile and children from database
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

      // Fetch children from children table
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('id, name, age, avatar_url, birth_date, gender, speech_difficulties, speech_difficulties_description, speech_development')
        .eq('parent_id', userId)
        .order('created_at');

      if (childrenError) {
        console.error("Children error:", childrenError);
        throw childrenError;
      }

      // Convert children data to the expected format
      const children: ChildProfile[] = childrenData?.map(child => ({
        id: child.id,
        name: child.name,
        gender: child.gender || 'other',
        avatarId: child.avatar_url ? parseInt(child.avatar_url) : 1,
        age: child.age || undefined,
        birthDate: child.birth_date ? new Date(child.birth_date) : null,
        speechDifficulties: child.speech_difficulties || [],
        speechDifficultiesDescription: child.speech_difficulties_description || undefined,
        speechDevelopment: child.speech_development as Record<string, string> || undefined
      })) || [];

      console.log("Profile loaded:", { username: profileData?.username, childrenCount: children.length });

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
