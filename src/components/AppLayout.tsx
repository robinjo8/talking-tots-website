
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthPage = location.pathname === "/login" || 
                     location.pathname === "/register" || 
                     location.pathname === "/reset-password" || 
                     location.pathname === "/update-password";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex-1 pt-20">
        {children}
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
}
