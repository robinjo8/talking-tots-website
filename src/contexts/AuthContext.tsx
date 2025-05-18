
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
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(
    () => {
      const storedIndex = localStorage.getItem('selectedChildIndex');
      return storedIndex ? parseInt(storedIndex) : null;
    }
  );

  useEffect(() => {
    // Save selected child index to localStorage
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
          username: data.username,
          children: metadata?.children || []
        });
      } catch (error: any) {
        console.error("Napaka pri pridobivanju profila:", error);
      }
    };

    // Listen for auth state changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { hasSession: !!session, userId: session?.user?.id });
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // Then check current session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        console.log("Initial session check:", { hasSession: !!session, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.user_metadata);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
      toast.success("Uspešno ste se odjavili");
      console.log("Sign out successful");
    } catch (error: any) {
      console.error("Napaka pri odjavi:", error);
      toast.error("Napaka pri odjavi: " + error.message);
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
