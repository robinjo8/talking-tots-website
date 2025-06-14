
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { useLocation } from "react-router-dom";
import { NavigationLink } from "./types";

interface DesktopNavigationProps {
  authenticatedLinks: NavigationLink[];
  unauthenticatedLinks: NavigationLink[];
  onNavigate: (path: string, options?: { expandSection?: string }) => void;
  onStartNow: () => void;
}

export function DesktopNavigation({ 
  authenticatedLinks, 
  unauthenticatedLinks, 
  onNavigate, 
  onStartNow 
}: DesktopNavigationProps) {
  const { user } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const scrollToSection = (path: string) => {
    if (path.startsWith('#')) {
      const sectionId = path.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
    }
  };

  return (
    <nav className="hidden lg:flex items-center gap-2">
      {user ? (
        <>
          {/* Desktop Navigation Links for authenticated users - show first 3 */}
          {authenticatedLinks.slice(0, 3).map((link, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="sm"
              onClick={() => !link.disabled && scrollToSection(link.path)} 
              disabled={link.disabled}
              className={`h-12 px-4 font-medium rounded-lg ${isActivePath(link.path) ? 'bg-accent' : ''}`}
            >
              {link.icon && <link.icon className="h-4 w-4 mr-2" />}
              {link.label}
            </Button>
          ))}
          
          <div className="flex items-center gap-2 ml-2">
            <UserProfile />
          </div>
        </>
      ) : (
        <>
          {/* Desktop Navigation Links for unauthenticated users */}
          {unauthenticatedLinks.map((link, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="sm"
              onClick={() => !link.disabled && scrollToSection(link.path)} 
              disabled={link.disabled}
              className={`h-12 px-4 font-medium rounded-lg ${isActivePath(link.path) ? 'bg-accent' : ''} ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {link.icon && <link.icon className="h-4 w-4 mr-2" />}
              {link.label}
            </Button>
          ))}
          
          <div className="flex items-center gap-2 ml-4">
            {/* Auth buttons */}
            <Button onClick={onStartNow} size="sm" className="h-12 px-6 bg-dragon-green hover:bg-dragon-green/90 text-white font-medium rounded-lg">
              Začni zdaj
            </Button>
            <Link to="/register">
              <Button variant="outline" size="sm" className="h-12 px-4 font-medium rounded-lg">
                <UserPlus className="h-4 w-4 mr-1" />
                Registracija
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="h-12 px-4 font-medium rounded-lg">
                Prijava
              </Button>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
