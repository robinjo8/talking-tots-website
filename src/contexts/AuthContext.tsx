
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

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session ? "user exists" : "no user");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("User authenticated:", session.user.id);
          fetchUserProfile(session.user.id, session.user.user_metadata);
        } else {
          console.log("No authenticated user");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju seje:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("Attempting to sign out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSelectedChildIndex(null);
      localStorage.removeItem('selectedChildIndex');
      console.log("Sign out successful");
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
      throw error; // Re-throw to handle in the UI component
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
