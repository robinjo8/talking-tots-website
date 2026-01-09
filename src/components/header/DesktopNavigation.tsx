
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, UserPlus, Building2 } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";

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

  return {
    navLinks: (
      <nav className="hidden lg:flex items-center gap-2">
        {/* Always show Cenik */}
        <Button
          type="button"
          variant="ghost"
          className="font-semibold rounded-full h-10 text-base px-4 uppercase"
          onClick={onCenikScroll}
        >
          Cenik
        </Button>
        
        {/* Always show Logopedski nasveti - visible for everyone */}
        <Button 
          variant="ghost" 
          onClick={() => handleNavigate("/logopedski-koticek")} 
          className={
            "rounded-full h-10 text-base px-4 font-semibold uppercase " +
            (isActivePath("/logopedski-koticek") ? 'bg-accent' : '')
          }
        >
          Logopedski nasveti
        </Button>
        
        {/* When LOGGED IN, show Moje aplikacije, Moja stran */}
        {user && (
          <>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigate("/moje-aplikacije")} 
              className={
                "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                (isActivePath("/moje-aplikacije") ? 'bg-accent' : '')
              }
            >
              Moje aplikacije
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigate("/moja-stran")} 
              className={
                "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                (isActivePath("/moja-stran") ? 'bg-accent' : '')
              }
            >
              Moja stran
            </Button>
          </>
        )}
      </nav>
    ),
    rightSection: user ? (
      <UserProfile />
    ) : (
      <div className="hidden lg:flex items-center gap-2">
        <Link to="/admin/login">
          <Button
            variant="outline"
            className="rounded-full h-10 text-sm px-4 font-semibold uppercase bg-app-blue hover:bg-app-blue/90 text-white border-app-blue"
          >
            <Building2 className="h-4 w-4 mr-1" />
            Za organizacije
          </Button>
        </Link>
        <Button
          onClick={onStartNow}
          className="rounded-full h-10 text-sm px-4 bg-dragon-green hover:bg-dragon-green/90 font-semibold text-white uppercase"
        >
          <Play className="h-4 w-4 mr-1" />
          Začni zdaj
        </Button>
        <Link to="/register">
          <Button
            variant="outline"
            className="rounded-full h-10 text-sm px-4 font-semibold uppercase"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Registracija
          </Button>
        </Link>
        <Link to="/login">
          <Button
            variant="outline"
            className="rounded-full h-10 text-sm px-4 font-semibold uppercase"
          >
            Prijava
          </Button>
        </Link>
      </div>
    )
  };
}
