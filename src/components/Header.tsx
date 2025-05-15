
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, BookOpen, ChevronDown, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "@/components/MobileMenu";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Import useSidebar, but handle the case when it's not available
const SidebarContext = React.createContext<any>(null);
const useSidebarSafe = () => {
  // Try to use the sidebar context if available
  const context = React.useContext(SidebarContext);
  // Return a default object if the sidebar context isn't available
  return context || { 
    setOpenMobile: () => {},
    openMobile: false
  };
};

export default function Header() {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebarSafe(); // Use our safe version
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleNavigate = (path: string, options?: { expandSection?: string }) => {
    navigate(path);
    
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  const navigationItems = [
    { label: "Moja stran", path: "/moja-stran" },
    { label: "Vaje", path: "/govorno-jezikovne-vaje" },
    { label: "Govorne igre", path: "/govorne-igre" },
    { label: "Izzivi", path: "/moji-izzivi" },
    { label: "Video navodila", path: "/video-navodila" },
  ];

  return (
    <header className="py-4 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" alt="Tomi the Dragon" className="h-8 md:h-10" />
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange">Talk</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {isMobile && selectedChild && (
            <span className="text-sm font-medium text-muted-foreground">
              {selectedChild.name}
            </span>
          )}
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <MobileMenu onItemClick={() => {}} />
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex items-center gap-6">
              {user && (
                <>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="font-medium flex items-center"
                      onClick={() => navigate('/admin')}
                    >
                      <Shield className="h-4 w-4 mr-2 text-dragon-green" />
                      Admin
                    </Button>
                  )}
                
                  <Button variant="ghost" className="font-medium opacity-50 cursor-not-allowed">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Logopedski kotiček
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="font-medium">
                        Moj profil
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {navigationItems.map((item) => (
                        <DropdownMenuItem key={item.label} onClick={() => handleNavigate(item.path)}>
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-2">
                  <UserProfile />
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    Prijava
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
