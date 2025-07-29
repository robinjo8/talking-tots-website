
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, UserPlus, BookOpen } from "lucide-react";
// UserProfile component removed - simplified for single child per parent
import { navigationLinks } from "./NavigationLinks";

interface DesktopNavigationProps {
  user: any;
  onStartNow: () => void;
  onCenikScroll: () => void;
}

export function DesktopNavigation({ user, onStartNow, onCenikScroll }: DesktopNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="hidden lg:flex items-center gap-4">
      {/* Always show Cenik */}
      <Button
        type="button"
        variant="ghost"
        className="font-semibold rounded-full h-12 lg:h-14 text-base lg:text-lg px-6 lg:px-8 lg:uppercase"
        onClick={onCenikScroll}
      >
        Cenik
      </Button>
      
      {/* When LOGGED IN, show main navigation left of user profile */}
      {user && (
        <>
          {/* Navigation links in new order: Vaje, Igre, Izzivi, Video navodila, Logopedski kotiček, Moja stran */}
          {navigationLinks.slice(0, 6).map((link, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              onClick={() => !link.disabled && handleNavigate(link.path)} 
              disabled={link.disabled}
              className={
                "rounded-full h-12 lg:h-14 text-base lg:text-lg px-6 lg:px-8 font-semibold lg:uppercase " +
                (isActivePath(link.path) ? 'bg-accent' : '')
              }
            >
              {link.label === "Logopedski nasveti" && <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />}
              {link.label}
            </Button>
          ))}
        </>
      )}
      
      {/* When LOGGED OUT, show consistent action buttons */}
      {!user && (
        <>
          <Button
            onClick={onStartNow}
            className="rounded-full h-12 lg:h-14 text-base lg:text-lg px-6 lg:px-8 bg-dragon-green hover:bg-dragon-green/90 font-semibold text-white min-w-[160px] lg:min-w-[180px] lg:uppercase"
          >
            <Play className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Začni zdaj
          </Button>
          <Link to="/register">
            <Button
              variant="outline"
              className="rounded-full h-12 lg:h-14 text-base lg:text-lg px-6 lg:px-8 font-semibold min-w-[160px] lg:min-w-[180px] lg:uppercase"
            >
              <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Registracija
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              className="rounded-full h-12 lg:h-14 text-base lg:text-lg px-6 lg:px-8 font-semibold min-w-[160px] lg:min-w-[180px] lg:uppercase"
            >
              Prijava
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
}
