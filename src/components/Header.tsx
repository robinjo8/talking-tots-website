import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MobileMenu } from "./header/MobileMenu";
import { DesktopNavigation } from "./header/DesktopNavigation";
import { authenticatedNavigationLinks, unauthenticatedNavigationLinks } from "./header/navigationLinks";
import { getAvatarSrc } from "@/utils/avatarUtils";

export default function Header() {
  const {
    user,
    profile,
    selectedChildIndex
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
  
  const handleNavigate = (path: string, options?: {
    expandSection?: string;
  }) => {
    navigate(path);
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };
  
  const handleStartNow = () => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    // If logged in, continue with existing behavior
    if (selectedChildIndex !== null && profile?.children) {
      navigate("/moja-stran");
    } else if (profile?.children?.length === 0) {
      navigate("/profile");
    } else {
      // We'll need to show the child selector dialog
      // For now, just navigate to the profile page
      navigate("/profile");
    }
  };
  
  return (
    <header className="py-6 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange">Talk</span>
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-8 w-8 ml-1"
            />
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Mobile layout - selected child name on left and hamburger on right */}
          <div className="lg:hidden flex items-center w-full justify-between">
            {/* Selected child display */}
            {selectedChild && (
              <div className="flex items-center gap-2">
                {selectedChild.avatarId > 0 && (
                  <Avatar className="h-6 w-6 border border-green-200">
                    <AvatarImage src={getAvatarSrc(selectedChild.avatarId)} alt={selectedChild.name} className="object-contain" />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {selectedChild.name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedChild.name}
                </span>
              </div>
            )}
            
            {/* Hamburger menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center ml-auto h-12 w-12 rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <MobileMenu 
                  authenticatedLinks={authenticatedNavigationLinks}
                  unauthenticatedLinks={unauthenticatedNavigationLinks}
                  onNavigate={handleNavigate}
                  onStartNow={handleStartNow}
                />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop navigation - shows above lg breakpoint */}
          <DesktopNavigation 
            authenticatedLinks={authenticatedNavigationLinks}
            unauthenticatedLinks={unauthenticatedNavigationLinks}
            onNavigate={handleNavigate}
            onStartNow={handleStartNow}
          />
        </div>
      </div>
    </header>
  );
}
