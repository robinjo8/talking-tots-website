
import { 
  Bell,
  Smartphone,
  CreditCard,
  Settings,
  LogOut,
  User,
  UserCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

interface SidebarNavigationProps {
  isMobileMenu?: boolean;
}

export function SidebarNavigation({ isMobileMenu = false }: SidebarNavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const handleNavigate = (path: string, options?: { expandSection?: string }) => {
    navigate(path);
    setOpenMobile(false);
    
    // If we need to expand a specific section, store it in localStorage
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  // Check if the current path matches the navigation item
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Main navigation items that should only show in mobile sidebar (duplicated from header in mobile view)
  const mainNavItems = isMobile || isMobileMenu ? [
    {
      label: "Profil starša",
      path: "/profile",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "personal" })
    },
    {
      label: "Profil otroka",
      path: "/profile",
      icon: UserCircle,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "children" })
    },
    {
      label: "Moja stran",
      path: "/moja-stran",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/moja-stran")
    },
    {
      label: "Vaje",
      path: "/govorno-jezikovne-vaje",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/govorno-jezikovne-vaje")
    },
    {
      label: "Govorne igre",
      path: "/govorne-igre",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/govorne-igre")
    },
    {
      label: "Izzivi",
      path: "/moji-izzivi",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/moji-izzivi")
    },
    {
      label: "Video navodila",
      path: "/video-navodila",
      icon: User,
      active: true,
      onClick: () => handleNavigate("/video-navodila")
    },
    {
      label: "Logopedski kotiček",
      path: "#",
      icon: User,
      active: false
    }
  ] : [];

  // Sidebar-specific items that are always shown in sidebar
  const sidebarItems = [
    {
      label: "Obvestila",
      icon: Bell,
      active: false
    },
    {
      label: "Moja naročnina",
      path: "/profile",
      icon: CreditCard,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "subscription" })
    },
    {
      label: "Nastavitve",
      path: "/profile",
      icon: Settings,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "settings" })
    },
    {
      label: "Odjava",
      icon: LogOut,
      active: true,
      onClick: () => {
        // Handle logout logic
        console.log("Logout clicked");
      }
    }
  ];

  // Combine items based on whether it's mobile or desktop view
  const menuItems = [...mainNavItems, ...sidebarItems];

  // Render different UI based on if it's a mobile menu or sidebar
  if (isMobileMenu) {
    return (
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className={`w-full justify-start text-left ${!item.active ? 'opacity-50 cursor-not-allowed' : ''} ${item.path && isActive(item.path) ? 'bg-accent text-accent-foreground' : ''}`}
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
      {menuItems.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton 
            onClick={() => item.active && (item.onClick ? item.onClick() : item.path ? handleNavigate(item.path) : null)}
            disabled={!item.active}
            className={`${!item.active ? 'opacity-50 cursor-not-allowed' : ''} ${item.path && isActive(item.path) ? 'bg-accent text-accent-foreground' : ''}`}
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
