
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  onItemClick?: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  const location = useLocation();
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
        console.log("MobileMenu - Checking admin status for user:", user.id);
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
  
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { to: "/moja-stran", label: "Moja stran" },
    { to: "/govorno-jezikovne-vaje", label: "Govorno-jezikovne vaje" },
    { to: "/govorne-igre", label: "Govorne igre" },
    { to: "/moji-izzivi", label: "Izzivi" },
    { to: "/video-navodila", label: "Video navodila" },
  ];
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <Link to="/" onClick={handleClick} className="flex items-center">
          <img src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" alt="Tomi" className="h-8" />
          <div className="flex items-center ml-2">
            <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-xl font-extrabold text-app-orange">Talk</span>
          </div>
        </Link>
      </div>
      
      <div className="space-y-2">
        {/* Admin Link - Only visible to admin users */}
        {isAdmin && (
          <Link to="/admin" onClick={handleClick}>
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/admin") ? "bg-dragon-green text-white" : ""
              )}
            >
              Admin portal
            </Button>
          </Link>
        )}
        
        {/* Regular navigation links */}
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={handleClick}>
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
            <Link to="/govorne-igre/spomin/spomin-r" onClick={handleClick}>
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
            
            <Link to="/govorne-igre/spomin/spomin-k" onClick={handleClick}>
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
            
            <Link to="/govorne-igre/spomin/spomin-s" onClick={handleClick}>
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
            
            <Link to="/govorne-igre/spomin/spomin-š" onClick={handleClick}>
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
      
      {!user && (
        <div className="mt-6 pt-6 border-t flex flex-col gap-2">
          <Link to="/login" onClick={handleClick}>
            <Button variant="outline" className="w-full">Prijava</Button>
          </Link>
          <Link to="/register" onClick={handleClick}>
            <Button variant="default" className="w-full">Registracija</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
