
import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
    <div className="flex min-h-screen w-full">
      <div className="relative flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
