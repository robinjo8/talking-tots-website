import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2, Info, MessageCircle } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";
import { useAuth } from "@/contexts/AuthContext";
import { UserNotificationBell } from "./UserNotificationBell";


interface DesktopNavigationProps {
  user: any;
  onStartNow: () => void;
}

export function DesktopNavigation({ user, onStartNow }: DesktopNavigationProps) {
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
      <div className="hidden lg:flex items-center justify-between w-full relative">
        {/* Left side - Logo */}
        <div className="flex items-center">
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
        </div>
        
        {/* Center - Navigation (absolutely centered) */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
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
          
          {user && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => handleProtectedNavigate("/poslusanje")} 
                className={
                  "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                  (isActivePath("/poslusanje") ? 'bg-accent' : '')
                }
              >
                Poslušanje
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleProtectedNavigate("/moje-aplikacije")} 
                className={
                  "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                  (isActivePath("/moje-aplikacije") ? 'bg-accent' : '')
                }
              >
                Govor
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleProtectedNavigate("/jezik")} 
                className={
                  "rounded-full h-10 text-base px-4 font-semibold uppercase " +
                  (isActivePath("/jezik") ? 'bg-accent' : '')
                }
              >
                Jezik
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
        
        {/* Right side - user profile or login buttons */}
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => navigate('/klepet')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Klepet"
            >
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => navigate('/informacije')}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Informacije"
          >
            <Info className="w-5 h-5 text-muted-foreground" />
          </button>
          {user ? (
            <>
              <UserNotificationBell />
              <UserProfile />
            </>
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
