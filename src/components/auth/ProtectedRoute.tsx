
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { user: !!user, isLoading, path: location.pathname });
  }, [user, isLoading, location]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("ProtectedRoute - User authenticated, rendering children");
  return <>{children}</>;
}
