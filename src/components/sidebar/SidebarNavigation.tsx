
import { 
  Home, 
  Activity,
  Gamepad,
  Award,
  Video,
  BookOpen,
  Bell,
  Smartphone,
  CreditCard
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarNavigationProps {
  isMobileMenu?: boolean;
}

export function SidebarNavigation({ isMobileMenu = false }: SidebarNavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const handleNavigate = (path: string, options?: { expandSection?: string }) => {
    navigate(path);
    setOpenMobile(false);
    
    // If we need to expand a specific section, store it in localStorage
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  // Menu items configuration with visibility control
  const menuItems = [
    // FIRST: Moja stran - should appear at the top of mobile navigation
    {
      label: "Moja stran",
      path: "/moja-stran",
      icon: Home,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // SECOND: Vaje
    {
      label: "Vaje",
      path: "/govorno-jezikovne-vaje",
      icon: Activity,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // THIRD: Govorne igre
    {
      label: "Govorne igre",
      path: "/govorne-igre",
      icon: Gamepad,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // FOURTH: Izzivi
    {
      label: "Izzivi",
      path: "/moji-izzivi",
      icon: Award,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // FIFTH: Video navodila
    {
      label: "Video navodila",
      path: "/video-navodila",
      icon: Video,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // SIXTH: Logopedski nasveti
    {
      label: "Logopedski nasveti",
      path: "/logopedski-koticek",
      icon: BookOpen,
      active: true,
      showOnDesktop: false,
      showOnMobile: true,
      showWhenLoggedIn: true,
    },
    // These items will always be shown on desktop, but hidden in mobile
    {
      label: "Logopedski nasveti",
      path: "/logopedski-koticek",
      icon: BookOpen,
      active: true,
      showOnDesktop: true,
      showOnMobile: false,
      showWhenLoggedIn: true,
    },
    {
      label: "Obvestila",
      icon: Bell,
      active: false,
      showOnDesktop: true,
      showOnMobile: false,
      showWhenLoggedIn: true,
    },
    {
      label: "Mobilna aplikacija",
      icon: Smartphone,
      active: false,
      showOnDesktop: true,
      showOnMobile: false,
      showWhenLoggedIn: true,
    },
    {
      label: "Moja naročnina",
      path: "/profile",
      icon: CreditCard,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "subscription" }),
      showOnDesktop: true,
      showOnMobile: false,
      showWhenLoggedIn: true,
    }
  ];

  // Helper function to check if a path is active
  const isActivePath = (path?: string) => {
    return path && location.pathname === path;
  };

  // For mobile menu UI - only show items if user is logged in for mobile view
  if (isMobileMenu && user) {
    return (
      <div className="space-y-1">
        {menuItems
          .filter(item => item.showOnMobile && item.showWhenLoggedIn)
          .map((item, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className={`w-full justify-start text-left ${!item.active ? 'opacity-50 cursor-not-allowed' : isActivePath(item.path) ? 'bg-accent' : ''}`}
              onClick={() => item.active && (item.onClick ? item.onClick() : item.path ? handleNavigate(item.path) : null)}
              disabled={!item.active}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
      </div>
    );
  } else if (isMobileMenu) {
    // If not logged in on mobile, don't show any sidebar navigation items
    return null;
  }
  
  // For sidebar UI - for desktop
  return (
    <SidebarMenu>
      {menuItems
        .filter(item => isMobile ? item.showOnMobile : item.showOnDesktop)
        .map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton 
              onClick={() => item.active && (item.onClick ? item.onClick() : item.path ? handleNavigate(item.path) : null)}
              disabled={!item.active}
              isActive={isActivePath(item.path)}
              className={!item.active ? 'opacity-50 cursor-not-allowed' : ''}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
