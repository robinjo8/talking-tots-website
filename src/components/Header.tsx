
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "@/components/MobileMenu";

export default function Header() {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;

  const handleNavigate = (path: string, options?: { expandSection?: string }) => {
    navigate(path);
    
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  // Navigation links for desktop header
  const navigationLinks = [
    { label: "Moja stran", path: "/moja-stran" },
    { label: "Vaje", path: "/govorno-jezikovne-vaje" },
    { label: "Govorne igre", path: "/govorne-igre" },
    { label: "Izzivi", path: "/moji-izzivi" },
    { label: "Video navodila", path: "/video-navodila" },
    { label: "Logopedski kotiček", path: "#", disabled: true }
  ];
  
  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

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
                  {/* Desktop Navigation Links */}
                  {navigationLinks.map((link, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className={`font-medium ${link.disabled ? 'opacity-50 cursor-not-allowed' : isActivePath(link.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => !link.disabled && handleNavigate(link.path)}
                      disabled={link.disabled}
                    >
                      {link.label === "Logopedski kotiček" && <BookOpen className="h-4 w-4 mr-2" />}
                      {link.label}
                    </Button>
                  ))}
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
