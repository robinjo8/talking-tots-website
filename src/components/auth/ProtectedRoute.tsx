
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
