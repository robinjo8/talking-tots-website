
import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setOpen } = useSidebar();
  
  // Set sidebar collapsed by default on desktop, expanded on mobile
  useEffect(() => {
    // On mobile, sidebar is hidden by default (shown via menu button)
    // On desktop, sidebar is visible by default
    setOpen(!isMobile);
  }, [isMobile, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <SidebarInset>
        <div className="relative flex-1 flex flex-col">
          <Header />
          <div className="mt-16 flex-1">
            {children}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
