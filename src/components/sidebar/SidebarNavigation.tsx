
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserWelcome } from "@/components/auth/UserWelcome";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Shield } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface SidebarNavigationProps {
  isMobileMenu?: boolean;
}

export function SidebarNavigation({ isMobileMenu = false }: SidebarNavigationProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Load the expanded section from localStorage
  const [openSection, setOpenSection] = useState(() => {
    return localStorage.getItem('expandSection') || '';
  });
  
  useEffect(() => {
    // Check if the current user has admin role
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking admin role:", error);
        }
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    }
    
    checkAdminRole();
  }, [user]);
  
  // Store the expanded section in localStorage
  useEffect(() => {
    if (openSection) {
      localStorage.setItem('expandSection', openSection);
    }
  }, [openSection]);

  if (!user) return null;

  const links = [
    { to: "/moja-stran", label: "Moja stran" },
    { to: "/govorno-jezikovne-vaje", label: "Govorno-jezikovne vaje" },
    { to: "/govorne-igre", label: "Govorne igre" },
    { to: "/moji-izzivi", label: "Izzivi" },
    { to: "/video-navodila", label: "Video navodila" },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLinkClick = () => {
    if (isMobileMenu) {
      setOpenMobile(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 px-2">
      <UserWelcome />
      
      {/* Admin Link - Only visible to admin users */}
      {isAdmin && (
        <Link to="/admin/dashboard" onClick={handleLinkClick}>
          <Button
            variant={location.pathname.includes("/admin") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              location.pathname.includes("/admin") ? "bg-dragon-green text-white" : ""
            )}
          >
            <Shield className="h-4 w-4 mr-2 text-dragon-green" />
            Admin portal
          </Button>
        </Link>
      )}
      
      {/* Regular navigation links */}
      {links.map((link) => (
        <Link key={link.to} to={link.to} onClick={handleLinkClick}>
          <Button
            variant={isActive(link.to) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive(link.to) ? "bg-dragon-green text-white" : ""
            )}
          >
            {link.label}
          </Button>
        </Link>
      ))}
      
      {/* Spomin games collapsible section */}
      <Collapsible open={openSection === 'spomin'} onOpenChange={() => setOpenSection(openSection === 'spomin' ? '' : 'spomin')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span>Spomin igre</span>
            <ChevronDown 
              className={cn("h-4 w-4 transition-transform", 
                openSection === 'spomin' ? "transform rotate-180" : ""
              )} 
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-2 space-y-2 mt-2">
          <Link to="/govorne-igre/spomin/spomin-r" onClick={handleLinkClick}>
            <Button
              variant={isActive("/govorne-igre/spomin/spomin-r") ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-sm",
                isActive("/govorne-igre/spomin/spomin-r") ? "bg-dragon-green text-white" : ""
              )}
              size="sm"
            >
              Spomin R
            </Button>
          </Link>
          
          <Link to="/govorne-igre/spomin/spomin-k" onClick={handleLinkClick}>
            <Button
              variant={isActive("/govorne-igre/spomin/spomin-k") ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-sm",
                isActive("/govorne-igre/spomin/spomin-k") ? "bg-dragon-green text-white" : ""
              )}
              size="sm"
            >
              Spomin K
            </Button>
          </Link>
          
          <Link to="/govorne-igre/spomin/spomin-s" onClick={handleLinkClick}>
            <Button
              variant={isActive("/govorne-igre/spomin/spomin-s") ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-sm",
                isActive("/govorne-igre/spomin/spomin-s") ? "bg-dragon-green text-white" : ""
              )}
              size="sm"
            >
              Spomin S
            </Button>
          </Link>
          
          <Link to="/govorne-igre/spomin/spomin-š" onClick={handleLinkClick}>
            <Button
              variant={isActive("/govorne-igre/spomin/spomin-š") ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-sm",
                isActive("/govorne-igre/spomin/spomin-š") ? "bg-dragon-green text-white" : ""
              )}
              size="sm"
            >
              Spomin Š
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
