
import { supabase } from "@/integrations/supabase/client";
import { ChildProfile } from "@/types/auth";

export const fetchUserProfile = async (userId: string) => {
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
      .select('id, name, age, avatar_url')
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
      gender: 'other', // Default since we don't store gender in DB yet
      avatarId: child.avatar_url ? parseInt(child.avatar_url) : 1,
      age: child.age || undefined,
      speechDifficulties: []
    })) || [];

    console.log("Profile loaded:", { username: profileData?.username, childrenCount: children.length });

    return {
      username: profileData?.username || null,
      children
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Return a basic profile even if there's an error to prevent infinite loading
    return {
      username: null,
      children: []
    };
  }
};
