
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsCheckingRole(false);
        return;
      }

      try {
        // Check if the user has admin role using the has_role function we created
        const { data, error } = await supabase.rpc('has_role', { role_name: 'admin' });
        
        if (error) {
          console.error("Napaka pri preverjanju administratorskih pravic:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error("Napaka:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user]);

  if (isLoading || isCheckingRole) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
