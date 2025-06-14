
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, BookOpen, UserPlus, Play, Home, Activity, Gamepad, Award, Video, Bell, CreditCard, User, LogOut, Check } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Header() {
  const {
    user,
    profile,
    selectedChildIndex,
    setSelectedChildIndex,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    setOpenMobile
  } = useSidebar();
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
  
  const handleNavigate = (path: string, options?: {
    expandSection?: string;
  }) => {
    navigate(path);
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };
  
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

  // Function to get child avatar source based on avatarId
  const getAvatarSrc = (avatarId: number): string => {
    const avatarImages = ["", "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"];
    return avatarImages[avatarId] || "";
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

  // Navigation links
  const navigationLinks = [{
    label: "Moja stran",
    path: "/moja-stran",
    icon: Home
  }, {
    label: "Vaje",
    path: "/govorno-jezikovne-vaje",
    icon: Activity
  }, {
    label: "Govorne igre",
    path: "/govorne-igre",
    icon: Gamepad
  }, {
    label: "Izzivi",
    path: "/moji-izzivi",
    icon: Award
  }, {
    label: "Video navodila",
    path: "/video-navodila",
    icon: Video
  }, {
    label: "Logopedski kotiček",
    path: "/logopedski-koticek",
    icon: BookOpen
  }, {
    label: "Obvestila",
    path: "#",
    icon: Bell,
    disabled: true
  }, {
    label: "Moja naročnina",
    path: "/profile",
    icon: CreditCard,
    options: { expandSection: "subscription" }
  }, {
    label: "Nastavitve",
    path: "/profile",
    icon: User
  }];

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Mobile Menu Component
  const MobileMenuContent = () => (
    <ScrollArea className="h-[90vh]">
      <div className="flex flex-col p-6 space-y-6">
        {/* Selected child name display - only if logged in and child selected */}
        {user && selectedChild && (
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            {selectedChild.avatarId > 0 && (
              <Avatar className="h-8 w-8 border border-green-200">
                <AvatarImage src={getAvatarSrc(selectedChild.avatarId)} alt={selectedChild.name} className="object-contain" />
                <AvatarFallback className="bg-green-100 text-green-800">
                  {selectedChild.name[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="font-semibold text-lg text-gray-900">
              {selectedChild.name}
            </span>
          </div>
        )}

        {/* Profile selection section - only if logged in */}
        {user && (
          <div className="space-y-4 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Profili</h3>
            
            {/* Parent profile */}
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChildIndex === null ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChild(null)}
            >
              <Avatar className="h-8 w-8 border border-blue-200">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {profile?.username?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{profile?.username || user.email}</div>
                <div className="text-xs text-blue-600 font-medium">Starš</div>
              </div>
              {selectedChildIndex === null && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </div>
            
            {/* Children profiles */}
            {profile?.children && profile.children.length > 0 && (
              <div className="space-y-2">
                {profile.children.map((child, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChildIndex === index ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectChild(index)}
                  >
                    <Avatar className="h-8 w-8 border border-green-200">
                      {child.avatarId > 0 ? (
                        <AvatarImage 
                          src={getAvatarSrc(child.avatarId)} 
                          alt={child.name} 
                          className="object-contain" 
                        />
                      ) : (
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {child.name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{child.name}</div>
                      <div className="text-xs text-green-600 font-medium">Otrok</div>
                    </div>
                    {selectedChildIndex === index && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main navigation - only if logged in */}
        {user && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigacija</h3>
            {navigationLinks.map((link, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className={`w-full justify-start text-left h-12 ${
                  !link.disabled ? '' : 'opacity-50 cursor-not-allowed'
                } ${isActivePath(link.path) ? 'bg-accent' : ''}`}
                onClick={() => {
                  if (!link.disabled) {
                    if (link.options) {
                      handleNavigate(link.path, link.options);
                    } else {
                      handleNavigate(link.path);
                    }
                  }
                }}
                disabled={link.disabled}
              >
                <link.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{link.label}</span>
              </Button>
            ))}
            
            {/* Logout button */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Odjava</span>
            </Button>
          </div>
        )}

        {/* Auth buttons for non-logged in users */}
        {!user && (
          <div className="space-y-4">
            <Button onClick={handleStartNow} className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white">
              <Play className="h-4 w-4 mr-2" />
              Začni zdaj
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => navigate("/login")}>
              Prijava
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => navigate("/register")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Registracija
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  return (
    <header className="py-4 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange">Talk</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Mobile layout - selected child name on left and hamburger on right */}
          <div className="lg:hidden flex items-center w-full justify-between">
            {/* Selected child display */}
            {selectedChild && (
              <div className="flex items-center gap-2">
                {selectedChild.avatarId > 0 && (
                  <Avatar className="h-6 w-6 border border-green-200">
                    <AvatarImage src={getAvatarSrc(selectedChild.avatarId)} alt={selectedChild.name} className="object-contain" />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {selectedChild.name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedChild.name}
                </span>
              </div>
            )}
            
            {/* Hamburger menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center ml-auto">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <MobileMenuContent />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop navigation - shows above lg breakpoint */}
          <nav className="hidden lg:flex items-center gap-6">
            {user ? (
              <>
                {/* Desktop Navigation Links */}
                {navigationLinks.slice(0, 6).map((link, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    onClick={() => !link.disabled && handleNavigate(link.path)} 
                    disabled={link.disabled}
                    className={isActivePath(link.path) ? 'bg-accent' : ''}
                  >
                    {link.label === "Logopedski kotiček" && <BookOpen className="h-4 w-4 mr-2" />}
                    {link.label}
                  </Button>
                ))}
                
                <div className="flex items-center gap-2">
                  <UserProfile />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* New orange "Začni zdaj" button */}
                <Button onClick={handleStartNow} size="sm" className="w-full sm:w-auto bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full min-w-[180px]">
                  Začni zdaj
                </Button>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="text-sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Registracija
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    Prijava
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
