
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ChildProfile = {
  name: string;
  gender: string;
  avatarId: number;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(() => {
    const savedIndex = localStorage.getItem('selectedChildIndex');
    return savedIndex ? parseInt(savedIndex) : null;
  });

  useEffect(() => {
    if (selectedChildIndex !== null) {
      localStorage.setItem('selectedChildIndex', selectedChildIndex.toString());
    } else {
      localStorage.removeItem('selectedChildIndex');
    }
  }, [selectedChildIndex]);

  useEffect(() => {
    const fetchUserProfile = async (userId: string, metadata: any) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        // Combine database profile with user metadata (which contains children)
        setProfile({
          username: data?.username,
          children: metadata?.children || []
        });
      } catch (error) {
        console.error("Napaka pri pridobivanju profila:", error);
      }
    };

    // First check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("User authenticated:", currentSession.user.id);
          await fetchUserProfile(currentSession.user.id, currentSession.user.user_metadata);
        } else {
          console.log("No authenticated user");
          setProfile(null);
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju seje:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession ? "user exists" : "no user");
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession.user.user_metadata);
      } else {
        setProfile(null);
      }
      
      if (event === 'SIGNED_OUT') {
        setSelectedChildIndex(null);
        console.log("User signed out, cleared selected child index");
      }
      
      setIsLoading(false);
    });

    // Call checkSession right away
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error in signOut function:", error);
        toast.error("Napaka pri odjavi: " + error.message);
        throw error;
      }
      
      // Clear local state regardless of the result from supabase
      setProfile(null);
      setSession(null);
      setUser(null);
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
      
      toast.success("Uspešno ste se odjavili");
      console.log("Sign out completed successfully");
    } catch (error: any) {
      console.error("Caught error during sign out:", error);
      toast.error("Napaka pri odjavi");
      throw error;
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
