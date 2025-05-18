
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession ? "user exists" : "no user");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Defer fetching profile with setTimeout to prevent auth deadlocks
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id, currentSession.user.user_metadata);
        }, 0);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // THEN check for initial session
    const fetchInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log("User authenticated:", initialSession.user.id);
          fetchUserProfile(initialSession.user.id, initialSession.user.user_metadata);
        } else {
          console.log("No authenticated user");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju seje:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        username: data.username,
        children: metadata?.children || []
      });
    } catch (error) {
      console.error("Napaka pri pridobivanju profila:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
      toast.success("Uspešno ste se odjavili");
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  useEffect(() => {
    if (selectedChildIndex !== null) {
      localStorage.setItem('selectedChildIndex', selectedChildIndex.toString());
    }
  }, [selectedChildIndex]);

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
