
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ChildProfile = {
  id?: string;
  name: string;
  gender: string;
  avatarId: number;
  avatarUrl?: string;
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
  selectedChild: ChildProfile | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // Function to fetch user profile and children (prioritizing database over metadata)
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // First, try to fetch children from the database
      const { data: dbChildren, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: true });

      if (childrenError) {
        console.log("Children fetch error:", childrenError);
      }

      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Profile error:", profileError);
      }

      let children: ChildProfile[] = [];

      // Prioritize database children if they exist
      if (dbChildren && dbChildren.length > 0) {
        children = dbChildren.map((child: any) => ({
          id: child.id, // Use actual database ID for persistence
          name: child.name,
          gender: child.gender || 'M',
          avatarId: 1, // Keep for backwards compatibility
          avatarUrl: child.avatar_url,
          age: child.age,
          birthDate: child.birth_date ? new Date(child.birth_date) : null,
          speechDifficulties: child.speech_difficulties || [],
          speechDifficultiesDescription: child.speech_difficulties_description || '',
          speechDevelopment: child.speech_development || {},
          isComplete: !!(child.speech_development && Object.keys(child.speech_development).length > 0)
        }));
        console.log("Using database children:", children);
      } else {
        // Check metadata for children and auto-sync if found
        console.log("No database children found, checking metadata...");
        
        const { data: userMetadata, error: metadataError } = await supabase.rpc('get_auth_user_data');
        
        if (metadataError) {
          console.error('Error fetching user metadata:', metadataError);
        } else {
          const metadataObject = userMetadata as any;
          if (metadataObject?.children && Array.isArray(metadataObject.children) && metadataObject.children.length > 0) {
            // Auto-sync metadata children to database
            console.log("Found metadata children, auto-syncing to database...");
            children = await syncChildrenFromMetadata(userId, metadataObject.children);
            if (children.length > 0) {
              toast.success("Podatki o otrocih so bili uspešno shranjeni");
            }
          }
        }
      }

      console.log('Final profile loaded:', {
        username: profileData?.username,
        childrenCount: children.length,
        children: children
      });

      setProfile({
        username: profileData?.username || null,
        children
      });

      // Set the first (and only) child as selected
      if (children.length > 0) {
        setSelectedChild(children[0]);
      } else {
        setSelectedChild(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Set a basic profile even if there's an error to prevent infinite loading
      setProfile({
        username: null,
        children: []
      });
      setSelectedChild(null);
    }
  };

  // Function to refresh profile data
  // Helper function to sync children from metadata with retry logic
  const syncChildrenFromMetadata = async (userId: string, metadataChildren: any[], retryCount = 0): Promise<ChildProfile[]> => {
    try {
      console.log(`Attempting to sync children from metadata (attempt ${retryCount + 1})`);
      
      const childrenForDB = metadataChildren.map(child => ({
        parent_id: userId,
        name: child.name,
        gender: child.gender || 'M',
        birth_date: child.birthDate ? new Date(child.birthDate).toISOString().split('T')[0] : null,
        age: child.age || 5,
        avatar_url: `/lovable-uploads/${child.avatarId || 1}.png`,
        speech_difficulties: child.speechDifficulties || [],
        speech_difficulties_description: child.speechDifficultiesDescription || "",
        speech_development: child.speechDevelopment || {}
      }));

      const { data: syncedChildren, error: syncError } = await supabase
        .from('children')
        .insert(childrenForDB)
        .select();

      if (syncError) {
        console.error("Sync error:", syncError);
        if (retryCount < 2) {
          // Retry up to 3 times with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return syncChildrenFromMetadata(userId, metadataChildren, retryCount + 1);
        }
        throw syncError;
      }

      if (syncedChildren && syncedChildren.length > 0) {
        console.log("Successfully synced children:", syncedChildren);
        return syncedChildren.map((child: any) => ({
          id: child.id,
          name: child.name,
          gender: child.gender || 'M',
          avatarId: 1,
          age: child.age,
          birthDate: child.birth_date ? new Date(child.birth_date) : null,
          speechDifficulties: child.speech_difficulties || [],
          speechDifficultiesDescription: child.speech_difficulties_description || '',
          speechDevelopment: child.speech_development || {},
          isComplete: !!(child.speech_development && Object.keys(child.speech_development).length > 0)
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Failed to sync children after retries:", error);
      return [];
    }
  };


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
          setSelectedChild(null);
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
      setSelectedChild(null);
      
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
    selectedChild,
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
