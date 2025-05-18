
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
import { useSidebar } from "@/components/ui/sidebar";

export default function Header() {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Create a safe version of setOpenMobile that won't throw errors
  const { setOpenMobile } = useSidebar();
  const [openMobile, setOpenMobileState] = useState(false);
  
  // Safe setter function for mobile menu state
  const handleSetOpenMobile = (value: boolean) => {
    setOpenMobileState(value);
    if (typeof setOpenMobile === 'function') {
      setOpenMobile(value);
    }
  };

  useEffect(() => {
    // Check if the current user has admin role
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        console.log("Header - Checking admin status for user:", user.id);
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
        console.log("Header - Admin check result:", !!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    }
    
    checkAdminRole();
  }, [user]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (openMobile) {
      handleSetOpenMobile(false);
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
    <header className="py-3 fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex justify-between items-center">
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
            <Sheet open={openMobile} onOpenChange={handleSetOpenMobile}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <MobileMenu onItemClick={() => handleSetOpenMobile(false)} />
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex items-center gap-4">
              {user && (
                <>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="font-medium flex items-center"
                      onClick={() => handleNavigate('/admin/dashboard')}
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
