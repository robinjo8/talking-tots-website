
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

  // Menu items configuration
  // For mobile, show all items. For desktop, only show non-header items
  const menuItems = [
    // These items will be shown in mobile only, and hidden on desktop
    {
      label: "Moja stran",
      path: "/moja-stran",
      icon: Home,
      active: true,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    {
      label: "Vaje",
      path: "/govorno-jezikovne-vaje",
      icon: Activity,
      active: true,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    {
      label: "Govorne igre",
      path: "/govorne-igre",
      icon: Gamepad,
      active: true,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    {
      label: "Izzivi",
      path: "/moji-izzivi",
      icon: Award,
      active: true,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    {
      label: "Video navodila",
      path: "/video-navodila",
      icon: Video,
      active: true,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    {
      label: "Logopedski kotiček",
      icon: BookOpen,
      active: false,
      showOnMobileOnly: !isMobileMenu ? true : false
    },
    // These items will always be shown in both mobile and desktop
    {
      label: "Obvestila",
      icon: Bell,
      active: false,
      showOnMobileOnly: false
    },
    {
      label: "Mobilna aplikacija",
      icon: Smartphone,
      active: false,
      showOnMobileOnly: false
    },
    {
      label: "Moja naročnina",
      path: "/profile",
      icon: CreditCard,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "subscription" }),
      showOnMobileOnly: false
    }
  ];

  // Helper function to check if a path is active
  const isActivePath = (path?: string) => {
    return path && location.pathname === path;
  };

  // Filter items based on whether we're in mobile view or not
  const filteredItems = isMobile 
    ? menuItems 
    : menuItems.filter(item => !item.showOnMobileOnly);

  // Render different UI based on if it's a mobile menu or sidebar
  if (isMobileMenu) {
    return (
      <div className="space-y-1">
        {menuItems.map((item, index) => (
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
  }
  
  // For sidebar UI
  return (
    <SidebarMenu>
      {filteredItems.map((item, index) => (
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
