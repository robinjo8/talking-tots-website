
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
        children = dbChildren.map((child: any) => {
        // Use avatarUrl directly from database and extract avatarId from proper mapping
        let avatarId = 0;
        if (child.avatar_url) {
          // Map from the exact AvatarSelector URLs to get correct ID
          const avatarImages = [
            "", // id 0
            "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", // id 1
            "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", // id 2
            "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", // id 3
            "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", // id 4
            "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", // id 5
            "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", // id 6
            "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", // id 7
            "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", // id 8
            "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", // id 9
            "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", // id 10
            "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", // id 11
            "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", // id 12
            "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", // id 13
            "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", // id 14
            "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"  // id 15
          ];
          
          avatarId = avatarImages.findIndex(url => url === child.avatar_url);
          if (avatarId === -1) avatarId = 0; // fallback to no avatar if not found
        }
          
          return {
            id: child.id, // Use actual database ID for persistence
            name: child.name,
            gender: child.gender || 'M',
            avatarId: avatarId, // Extract from URL for proper mapping
            avatarUrl: child.avatar_url,
            age: child.age,
            birthDate: child.birth_date ? new Date(child.birth_date) : null,
            speechDifficulties: child.speech_difficulties || [],
            speechDifficultiesDescription: child.speech_difficulties_description || '',
            speechDevelopment: child.speech_development || {},
            isComplete: !!(child.speech_development && Object.keys(child.speech_development).length > 0)
          };
        });
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
  // Helper function to sync children from metadata with retry logic
  const syncChildrenFromMetadata = async (userId: string, metadataChildren: any[], retryCount = 0): Promise<ChildProfile[]> => {
    try {
      console.log(`Attempting to sync children from metadata (attempt ${retryCount + 1})`);
      
      const childrenForDB = metadataChildren.map(child => {
        // Map avatarId to correct avatar URL using the same mapping as AvatarSelector
        const avatarImages = [
          "",
          "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png",
          "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png",
          "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png",
          "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png",
          "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png",
          "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png",
          "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png",
          "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png",
          "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png",
          "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png",
          "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png",
          "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png",
          "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png",
          "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png",
          "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"
        ];
        
        const avatarId = child.avatarId || 0;
        const avatarUrl = avatarId > 0 && avatarId < avatarImages.length ? avatarImages[avatarId] : "";
        
        return {
          parent_id: userId,
          name: child.name,
          gender: child.gender || 'M',
          birth_date: child.birthDate ? new Date(child.birthDate).toISOString().split('T')[0] : null,
          age: child.age || 5,
          avatar_url: avatarUrl,
          speech_difficulties: child.speechDifficulties || [],
          speech_difficulties_description: child.speechDifficultiesDescription || "",
          speech_development: child.speechDevelopment || {}
        };
      });

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
        return syncedChildren.map((child: any) => {
          // Use avatarUrl directly from database and extract avatarId from proper mapping
          let avatarId = 0;
          if (child.avatar_url) {
            // Map from the exact AvatarSelector URLs to get correct ID
            const avatarImages = [
              "", // id 0
              "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", // id 1
              "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", // id 2
              "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", // id 3
              "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", // id 4
              "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", // id 5
              "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", // id 6
              "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", // id 7
              "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", // id 8
              "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", // id 9
              "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", // id 10
              "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", // id 11
              "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", // id 12
              "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", // id 13
              "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", // id 14
              "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"  // id 15
            ];
            
            avatarId = avatarImages.findIndex(url => url === child.avatar_url);
            if (avatarId === -1) avatarId = 0; // fallback to no avatar if not found
          }
          
          return {
            id: child.id,
            name: child.name,
            gender: child.gender || 'M',
            avatarId: avatarId, // Extract from URL for proper mapping
            avatarUrl: child.avatar_url,
            age: child.age,
            birthDate: child.birth_date ? new Date(child.birth_date) : null,
            speechDifficulties: child.speech_difficulties || [],
            speechDifficultiesDescription: child.speech_difficulties_description || '',
            speechDevelopment: child.speech_development || {},
            isComplete: !!(child.speech_development && Object.keys(child.speech_development).length > 0)
          };
        });
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        // NOTE: Logopedist redirection is handled separately in Login.tsx and AdminLogin.tsx
        // This prevents automatic redirection from the user portal to admin portal
        
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
      
      // Check if we have a valid session before attempting signOut
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log("No active session found, clearing local state only");
        // Clear local state even if no session exists
        setUser(null);
        setSession(null);
        setProfile(null);
        toast.success("Uspešno ste se odjavili");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        // Even if signOut fails, clear local state to ensure user appears logged out
        setUser(null);
        setSession(null);
        setProfile(null);
        
        // Only show error for non-session related issues
        if (!error.message.includes("session") && !error.message.includes("Session")) {
          toast.error("Napaka pri odjavi: " + error.message);
        } else {
          toast.success("Uspešno ste se odjavili");
        }
        return;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log("Sign out successful");
      toast.success("Uspešno ste se odjavili");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      // Always clear local state to ensure clean logout
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success("Uspešno ste se odjavili");
    }
  };

  const selectedChild = profile?.children?.[0] || null;

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
