
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function checkIsAdmin() {
      if (!user) {
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
          toast.error("Error verifying admin access");
        } else {
          setIsAdmin(!!data);
          if (!data) {
            toast.error("You do not have admin access");
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
  
  if (isLoading || adminCheckLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    // If not admin but authenticated, navigate to home instead of login
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
