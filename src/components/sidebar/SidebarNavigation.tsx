
import { 
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

interface SidebarNavigationProps {
  isMobileMenu?: boolean;
}

export function SidebarNavigation({ isMobileMenu = false }: SidebarNavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  
  const handleNavigate = (path: string, options?: { expandSection?: string }) => {
    navigate(path);
    setOpenMobile(false);
    
    // If we need to expand a specific section, store it in localStorage
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  // Menu items configuration - removed the items that are now in the header
  const menuItems = [
    {
      label: "Obvestila",
      icon: Bell,
      active: false
    },
    {
      label: "Mobilna aplikacija",
      icon: Smartphone,
      active: false
    },
    {
      label: "Moja naročnina",
      path: "/profile",
      icon: CreditCard,
      active: true,
      onClick: () => handleNavigate("/profile", { expandSection: "subscription" })
    }
  ];

  // Render different UI based on if it's a mobile menu or sidebar
  if (isMobileMenu) {
    return (
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className={`w-full justify-start text-left ${!item.active ? 'opacity-50 cursor-not-allowed' : ''}`}
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
