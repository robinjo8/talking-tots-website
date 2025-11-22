import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MobileMenu } from "./header/MobileMenu";
import { DesktopNavigation } from "./header/DesktopNavigation";
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

    // If logged in, redirect to moje-aplikacije
    navigate("/moje-aplikacije");
  };

  // Cenik scroll handler
  const handleCenikScroll = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const cenikSection = document.getElementById("cenik");
    if (cenikSection) {
      cenikSection.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      // fallback: navigate to homepage and scroll after.
      navigate("/", {
        replace: true
      });
      setTimeout(() => {
        const cenikSectionRetry = document.getElementById("cenik");
        if (cenikSectionRetry) {
          cenikSectionRetry.scrollIntoView({
            behavior: "smooth"
          });
        }
      }, 300);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return (
    <>
      <header className="py-4 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Desktop layout - centered */}
        <div className="hidden lg:flex items-center justify-center w-full">
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo */}
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
                <span className="text-2xl md:text-3xl font-extrabold text-dragon-green uppercase mx-0 px-0 lg:text-3xl">Tomi</span>
                <span className="text-2xl md:text-3xl font-extrabold text-app-orange uppercase lg:text-3xl">Talk</span>
              </div>
            </Link>
            
            {/* Navigation */}
            <DesktopNavigation user={user} onStartNow={handleStartNow} onCenikScroll={handleCenikScroll} />
            {showInstall && (
              <Button variant="secondary" onClick={handleInstallClick}>
                Namesti aplikacijo
              </Button>
            )}
          </div>
        </div>

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
          <MobileMenu user={user} profile={profile} selectedChild={selectedChild} onSignOut={handleSignOut} onStartNow={handleStartNow} onCenikScroll={handleCenikScroll} />
        </div>
      </header>
    </>
  );
}