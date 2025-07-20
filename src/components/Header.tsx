import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { DesktopNavigation } from "./header/DesktopNavigation";
export default function Header() {
  const {
    user,
    profile,
    selectedChildIndex,
    setSelectedChildIndex,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
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
  const handleSelectChild = (index: number | null) => {
    try {
      setSelectedChildIndex(index);
      if (index !== null) {
        localStorage.setItem('selectedChildIndex', index.toString());
      } else {
        localStorage.removeItem('selectedChildIndex');
      }
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return <header className="py-4 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl font-extrabold text-dragon-green uppercase lg:text-2xl mx-0 px-0">Tomi</span>
            <span className="text-2xl md:text-3xl font-extrabold text-app-orange uppercase lg:text-2xl">Talk</span>
          </div>
        </Link>
        
        {/* Main navigation and action buttons - improved centering */}
        <div className="flex items-center justify-center gap-3 flex-1">
          <MobileMenu user={user} profile={profile} selectedChildIndex={selectedChildIndex} selectedChild={selectedChild} onSelectChild={handleSelectChild} onSignOut={handleSignOut} onStartNow={handleStartNow} onCenikScroll={handleCenikScroll} />

          <DesktopNavigation user={user} onStartNow={handleStartNow} onCenikScroll={handleCenikScroll} />
        </div>
      </div>
    </header>;
}