
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

    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log("Auth state changed:", _event, currentSession ? "user exists" : "no user");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id, currentSession.user.user_metadata);
        }, 0);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // Then check for existing session
    const setData = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("User authenticated:", currentSession.user.id);
          fetchUserProfile(currentSession.user.id, currentSession.user.user_metadata);
        } else {
          console.log("No authenticated user");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju seje:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
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
