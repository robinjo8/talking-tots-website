
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ChildProfile = {
  id?: string;
  name: string;
  gender: string;
  avatarId: number;
  age?: number;
  speechDifficulties?: string[];
};

type Profile = {
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
      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch children from children table
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('id, name, age, avatar_url')
        .eq('parent_id', userId)
        .order('created_at');

      if (childrenError) {
        throw childrenError;
      }

      // Convert children data to the expected format
      const children: ChildProfile[] = childrenData?.map(child => ({
        id: child.id,
        name: child.name,
        gender: 'other', // Default since we don't store gender in DB yet
        avatarId: child.avatar_url ? parseInt(child.avatar_url) : 1,
        age: child.age,
        speechDifficulties: []
      })) || [];

      setProfile({
        username: profileData?.username || null,
        children
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to user metadata if database query fails
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
    // Check if there's a selectedChildIndex in localStorage during initialization
    const storedChildIndex = localStorage.getItem('selectedChildIndex');
    if (storedChildIndex) {
      setSelectedChildIndex(parseInt(storedChildIndex));
    }

    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    setData();

    return () => {
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
      
      // Clear local state regardless of whether there was a session
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
