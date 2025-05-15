
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    async function checkIsAdmin() {
      if (!user) {
        console.log("AdminRoute - No user");
        setAdminCheckLoading(false);
        return;
      }
      
      try {
        console.log("Checking admin status for user:", user.id);
        // Check if the user has an admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        console.log("Admin check result:", { data, error });
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
          if (!data) {
            console.log("User is not an admin");
          } else {
            console.log("User is an admin");
          }
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      } finally {
        setAdminCheckLoading(false);
      }
    }
    
    checkIsAdmin();
  }, [user]);
  
  useEffect(() => {
    console.log("AdminRoute - Auth state:", { 
      user: !!user, 
      isLoading, 
      adminCheckLoading, 
      isAdmin,
      path: location.pathname 
    });
  }, [user, isLoading, adminCheckLoading, isAdmin, location]);
  
  if (isLoading || adminCheckLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log("AdminRoute - No user, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!isAdmin) {
    // If not admin but authenticated, navigate to home instead of login
    console.log("AdminRoute - Not admin, redirecting to home");
    toast.error("Nimate administratorskih pravic");
    return <Navigate to="/" replace />;
  }
  
  console.log("AdminRoute - Admin access granted, rendering children");
  return <>{children}</>;
}
