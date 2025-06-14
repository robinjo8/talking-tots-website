
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationLink } from "./types";
import { getAvatarSrc } from "@/utils/avatarUtils";

interface MobileMenuProps {
  authenticatedLinks: NavigationLink[];
  unauthenticatedLinks: NavigationLink[];
  onNavigate: (path: string, options?: { expandSection?: string }) => void;
  onStartNow: () => void;
}

export function MobileMenu({ 
  authenticatedLinks, 
  unauthenticatedLinks, 
  onNavigate, 
  onStartNow 
}: MobileMenuProps) {
  const { user, profile, selectedChildIndex, setSelectedChildIndex, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

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

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (link: NavigationLink) => {
    if (link.path.startsWith('#')) {
      // Close mobile menu first
      const closeButton = document.querySelector('[data-state="open"] button');
      if (closeButton) {
        (closeButton as HTMLButtonElement).click();
      }
      
      // Then scroll to section after a brief delay
      setTimeout(() => {
        const sectionId = link.path.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (link.options) {
      onNavigate(link.path, link.options);
    } else {
      onNavigate(link.path);
    }
  };

  return (
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
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Otroški profili</span>
                </div>
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

        {/* Main navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigacija</h3>
          {(user ? authenticatedLinks : unauthenticatedLinks).map((link, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className={`w-full justify-start text-left h-12 ${
                !link.disabled ? '' : 'opacity-50 cursor-not-allowed'
              } ${isActivePath(link.path) ? 'bg-accent' : ''}`}
              onClick={() => {
                if (!link.disabled) {
                  handleNavigation(link);
                }
              }}
              disabled={link.disabled}
            >
              {link.icon && <link.icon className="h-5 w-5 mr-3" />}
              <span className="font-medium">{link.label}</span>
            </Button>
          ))}
          
          {/* Logout button for authenticated users */}
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Odjava</span>
            </Button>
          )}
        </div>

        {/* Auth buttons for non-logged in users */}
        {!user && (
          <div className="space-y-4">
            <Button onClick={onStartNow} className="w-full h-12 bg-dragon-green hover:bg-dragon-green/90 text-white">
              <span>Začni zdaj</span>
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => navigate("/login")}>
              Prijava
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => navigate("/register")}>
              Registracija
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
