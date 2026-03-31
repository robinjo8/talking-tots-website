import { supabase } from "@/integrations/supabase/client";

let cachedResult: { userId: string; isDev: boolean } | null = null;

export const isDevUser = async (userId?: string | null): Promise<boolean> => {
  if (!userId) return false;
  
  // Return cached result if same user
  if (cachedResult && cachedResult.userId === userId) {
    return cachedResult.isDev;
  }

  const { data } = await supabase
    .from("admin_permissions")
    .select("role")
    .eq("user_id", userId)
    .eq("is_active", true)
    .in("role", ["super_admin"])
    .maybeSingle();

  const isDev = !!data;
  cachedResult = { userId, isDev };
  return isDev;
};

// Synchronous check using cached value (for initial render)
export const isDevUserCached = (): boolean => {
  return cachedResult?.isDev ?? false;
};

// Clear cache on logout
export const clearDevCache = () => {
  cachedResult = null;
};
