
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }
      
      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        setIsAdmin(!!data);
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking admin status:", error);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
      } finally {
        setCheckingAdmin(false);
      }
    }
    
    checkAdminStatus();
  }, [user]);
  
  if (checkingAdmin) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!isAdmin) {
    toast.error("Nimate administratorskih pravic");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
