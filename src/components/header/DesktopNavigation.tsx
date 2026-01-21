import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";
import { useAuth } from "@/contexts/AuthContext";


interface DesktopNavigationProps {
  user: any;
  onStartNow: () => void;
  onCenikNavigate: () => void;
}

export function DesktopNavigation({ user, onStartNow, onCenikNavigate }: DesktopNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { isSubscribed, isLoading } = useSubscriptionContext();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // If user is a logopedist, show simplified navigation with notification and organization button
  if (user && profile?.isLogopedist) {
    return (
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left side - Logo */}
        <Link 
          to="/" 
          className="flex items-center"
        >
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange uppercase">Talk</span>
          </div>
        </Link>
        
        {/* Right side - Notification + Button */}
        <div className="flex items-center gap-4">
          {/* Obvestilo za logopedista */}
          <div className="text-sm text-muted-foreground bg-accent px-4 py-2 rounded-lg border border-border">
            Prijavljeni ste s profilom "<span className="font-semibold text-foreground">Za organizacije</span>". 
            Za preusmeritev pritisnite gumb →
          </div>
          
          {/* Gumb ZA ORGANIZACIJE */}
          <Button
            onClick={() => navigate('/admin')}
            className="rounded-full h-10 text-sm px-4 font-semibold uppercase bg-app-blue hover:bg-app-blue/90 text-white"
          >
            <Building2 className="h-4 w-4 mr-1" />
            Za organizacije
          </Button>
        </div>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleProtectedNavigate = (path: string) => {
    // Block navigation while loading or if not subscribed
    if (isLoading) {
      // Still checking subscription, don't navigate yet
      return;
    }
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left side - Logo and Navigation together */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-dragon-green uppercase">Tomi</span>
              <span className="text-2xl font-extrabold text-app-orange uppercase">Talk</span>
            </div>
          </Link>
          
          {/* Navigation right next to logo */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Always show Cenik */}
            <Button
              type="button"
              variant="ghost"
              className="font-semibold rounded-full h-10 text-base px-4 uppercase"
              onClick={onCenikNavigate}
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
            
            {/* When LOGGED IN, show Moje aplikacije, Moja stran - with subscription check */}
            {user && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleProtectedNavigate("/moje-aplikacije")} 
                  className={
                    "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                    (isActivePath("/moje-aplikacije") ? 'bg-accent' : '')
                  }
                >
                  Moje aplikacije
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleProtectedNavigate("/moja-stran")} 
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
        </div>
        
        {/* Right side - user profile or login buttons */}
        <div className="flex items-center gap-2">
          {user ? (
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
              <Link to="/login">
                <Button
                  className="rounded-full h-10 text-sm px-4 font-semibold uppercase bg-dragon-green hover:bg-dragon-green/90 text-white"
                >
                  Prijava
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <SubscriptionRequiredModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
}
