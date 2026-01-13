import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";


interface DesktopNavigationProps {
  user: any;
  onStartNow: () => void;
  onCenikNavigate: () => void;
}

export function DesktopNavigation({ user, onStartNow, onCenikNavigate }: DesktopNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubscribed, isLoading } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleProtectedNavigate = (path: string) => {
    if (!isSubscribed && !isLoading) {
      setShowSubscriptionModal(true);
      return;
    }
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return {
    navLinks: (
      <>
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
        
        <SubscriptionRequiredModal 
          open={showSubscriptionModal} 
          onOpenChange={setShowSubscriptionModal}
        />
      </>
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
        <Link to="/login">
          <Button
            className="rounded-full h-10 text-sm px-4 font-semibold uppercase bg-dragon-green hover:bg-dragon-green/90 text-white"
          >
            Prijava
          </Button>
        </Link>
      </div>
    )
  };
}
