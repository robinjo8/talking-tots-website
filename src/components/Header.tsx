import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MobileMenu } from "./header/MobileMenu";
import { DesktopNavigation } from "./header/DesktopNavigation";
import { MissingChildBanner } from "./MissingChildBanner";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";

export default function Header() {
  const {
    user,
    profile,
    selectedChild,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { canInstall, promptInstall, isIOSDevice, isStandalone, isInstalled } = usePWA();
  const showInstall = (!isStandalone && !isInstalled) && (isIOSDevice || canInstall);
  const { isSubscribed, isLoading } = useSubscriptionContext();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleInstallClick = async () => {
    try {
      if (canInstall) {
        await promptInstall();
      } else if (isIOSDevice) {
        toast.info("Za namestitev na iOS: Share → Add to Home Screen");
      } else {
        toast.message("Namestitev ni na voljo na tej napravi.");
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const handleStartNow = () => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    // If still checking subscription, do nothing
    if (isLoading) {
      return;
    }

    // If not subscribed, show modal
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }

    // If logged in and subscribed, redirect to moje-aplikacije
    navigate("/moje-aplikacije");
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="py-4 px-4 md:px-10 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Desktop layout - rendered as proper component */}
        <DesktopNavigation user={user} onStartNow={handleStartNow} />

        {/* Mobile layout - logo left, profile right */}
        <div className="lg:hidden flex items-center justify-between w-full">
          {/* Logo on far left */}
          <Link 
            to="/" 
            className="flex items-center gap-2"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-center">
              <span className="text-2xl md:text-3xl font-extrabold text-dragon-green uppercase lg:text-2xl mx-0 px-0">Tomi</span>
              <span className="text-2xl md:text-3xl font-extrabold text-app-orange uppercase lg:text-2xl">Talk</span>
            </div>
          </Link>
          
          {/* Mobile menu and profile on far right */}
          <MobileMenu user={user} profile={profile} selectedChild={selectedChild} onSignOut={handleSignOut} onStartNow={handleStartNow} />
        </div>
      </header>
      <MissingChildBanner />
      
      <SubscriptionRequiredModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal}
      />
    </div>
  );
}
