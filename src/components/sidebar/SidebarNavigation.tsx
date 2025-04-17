
import { Sparkles, Home, BookText } from "lucide-react";
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
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMobile(false);
  };

  const handleAnchorNavigate = (path: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpenMobile(false);
  };

  // Render different UI based on if it's a mobile menu or sidebar
  if (isMobileMenu) {
    return (
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left"
          onClick={() => handleAnchorNavigate("#features")}
        >
          <Sparkles className="h-4 w-4 mr-2 text-dragon-green" />
          Funkcije
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left"
          onClick={() => handleAnchorNavigate("#cta")}
        >
          <Home className="h-4 w-4 mr-2 text-app-orange" />
          Začni
        </Button>
        
        {user && (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left"
            onClick={() => handleNavigate("/moja-stran")}
          >
            <BookText className="h-4 w-4 mr-2 text-dragon-green" />
            Moja stran
          </Button>
        )}
      </div>
    );
  }
  
  // For sidebar UI
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => handleAnchorNavigate("#features")}
          tooltip="Funkcije"
        >
          <Sparkles className="text-dragon-green" />
          <span>Funkcije</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => handleAnchorNavigate("#cta")}
          tooltip="Začni"
        >
          <Home className="text-app-orange" />
          <span>Začni</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {user && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={() => handleNavigate("/moja-stran")}
            tooltip="Moja stran"
          >
            <BookText className="text-dragon-green" />
            <span>Moja stran</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
