import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, LogOut, Home, Activity, BookOpen, Bell, CreditCard, User, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSelector } from "./ProfileSelector";
import { Profile } from "@/contexts/AuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionRequiredModal } from "@/components/subscription/SubscriptionRequiredModal";

interface MobileMenuProps {
  user: any;
  profile: Profile | null;
  selectedChild: any;
  onSignOut: () => void;
  onStartNow: () => void;
  onCenikNavigate: () => void;
}
export function MobileMenu({
  user,
  profile,
  selectedChild,
  onSignOut,
  onStartNow,
  onCenikNavigate
}: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubscribed, isLoading } = useSubscriptionContext();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // If user is a logopedist, show simplified menu with organization button
  if (user && profile?.isLogopedist) {
    return (
      <div className="lg:hidden flex items-center gap-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center ml-auto">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-80 flex flex-col h-full">
            <div className="flex flex-col p-6 space-y-6">
              {/* Obvestilo za logopedista */}
              <div className="p-3 bg-accent rounded-md border border-border">
                <div className="text-sm text-muted-foreground">
                  Prijavljeni ste s profilom "<span className="font-semibold text-foreground">Za organizacije</span>". 
                  Za preusmeritev pritisnite spodnji gumb.
                </div>
              </div>
              
              {/* Gumb ZA ORGANIZACIJE */}
              <Button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin');
                }}
                className="w-full h-12 rounded-full text-base font-semibold uppercase bg-app-blue hover:bg-app-blue/90 text-white"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Za organizacije
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  onSignOut();
                }} 
                className="w-full justify-start text-left h-12 mt-4 text-destructive uppercase"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Odjava
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  
  const getAvatarSrc = (avatarId: number): string => {
    const avatarImages = ["", "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"];
    return avatarImages[avatarId] || "";
  };
  const handleNavigate = (path: string, options?: {
    expandSection?: string;
  }) => {
    setIsOpen(false);
    navigate(path);
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };
  
  const handleProtectedNavigate = (path: string) => {
    // Block navigation while loading or if not subscribed
    if (isLoading) {
      // Still checking subscription, don't navigate yet
      return;
    }
    if (!isSubscribed) {
      setIsOpen(false);
      setShowSubscriptionModal(true);
      return;
    }
    setIsOpen(false);
    navigate(path);
  };
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };
  // Note: isOpen state is declared at the top of the component

  const handleCenikClick = () => {
    setIsOpen(false);
    onCenikNavigate();
  };

  return <div className="lg:hidden flex items-center gap-2">
      {/* Show selected child first (left side) */}
      {selectedChild && <div className="flex items-center gap-2">
          {selectedChild.avatarId > 0 && <Avatar className="h-6 w-6 border border-green-200">
              <AvatarImage src={selectedChild.avatarUrl || getAvatarSrc(selectedChild.avatarId)} alt={selectedChild.name} className="object-contain" />
              <AvatarFallback className="bg-green-100 text-green-800">
                {selectedChild.name[0]}
              </AvatarFallback>
            </Avatar>}
          <span className="text-sm font-medium text-muted-foreground uppercase">
            {selectedChild.name}
          </span>
        </div>}
      
      {/* Hamburger menu on the right */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center ml-auto">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 w-80 lg:w-[600px] flex flex-col h-full">
          <ScrollArea className="flex-1">
            <div className="flex flex-col p-6 space-y-6">
              {/* Navigation for logged in users */}
              
              {user && <>
                  {/* Profile section simplified for single child */}
                  {selectedChild && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                      <Avatar className="h-10 w-10 border border-green-200">
                        {selectedChild.avatarId > 0 ? (
                          <AvatarImage 
                            src={selectedChild.avatarUrl || getAvatarSrc(selectedChild.avatarId)}
                            alt={selectedChild.name} 
                            className="object-contain" 
                          />
                        ) : (
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {selectedChild.name[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-base uppercase">{selectedChild.name}</div>
                        <div className="text-sm text-muted-foreground">Aktivni profil</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Main navigation */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigacija</h3>
                    
                    {/* Moja stran */}
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start text-left h-12 uppercase ${isActivePath('/moja-stran') ? 'bg-accent' : ''}`} 
                      onClick={() => handleProtectedNavigate('/moja-stran')}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Moja stran
                    </Button>
                    
                    {/* Moje aplikacije */}
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start text-left h-12 uppercase ${isActivePath('/moje-aplikacije') ? 'bg-accent' : ''}`} 
                      onClick={() => handleProtectedNavigate('/moje-aplikacije')}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Moje aplikacije
                    </Button>
                    
                    {/* Logopedski nasveti */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 uppercase ${isActivePath('/logopedski-koticek') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/logopedski-koticek')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Logopedski nasveti
                    </Button>
                  </div>
                  
                  {/* User menu items */}
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Račun</h3>
                    
                    {/* Nastavitve */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 uppercase ${isActivePath('/profile') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Nastavitve
                    </Button>
                    
                    {/* Moja naročnina */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 uppercase ${isActivePath('/profile') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/profile', {
                  expandSection: 'subscription'
                })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Moja naročnina
                    </Button>
                    
                    {/* Obvestila */}
                    <Button variant="ghost" className="w-full justify-start text-left h-12 uppercase opacity-50 cursor-not-allowed" disabled={true}>
                      <Bell className="h-4 w-4 mr-2" />
                      Obvestila
                    </Button>
                    
                    {/* Cenik */}
                    <Button variant="ghost" className="w-full justify-start text-left h-12 uppercase" onClick={handleCenikClick}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cenik
                    </Button>
                    
                    {/* Odjava */}
                    <Button variant="outline" onClick={onSignOut} className="w-full justify-start text-left h-12 mt-4 text-red-600 uppercase">
                      <LogOut className="h-4 w-4 mr-2" />
                      Odjava
                    </Button>
                  </div>
                </>}
              
              {!user && <div className="flex flex-col gap-3">
                  <Button className="w-full h-12 rounded-full text-base bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold uppercase" onClick={() => navigate("/login")}>
                    Prijava
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold uppercase" onClick={handleCenikClick}>
                    Cenik
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold uppercase" onClick={() => navigate("/logopedski-koticek")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Logopedski nasveti
                  </Button>
                </div>}
            </div>
          </ScrollArea>
          
          {/* Za organizacije - fixed at bottom for non-logged users */}
          {!user && (
            <div className="p-6 pt-4">
              <Button 
                className="w-full h-12 rounded-full text-base font-semibold uppercase bg-app-blue text-white hover:bg-app-blue/90 border-0" 
                onClick={() => navigate("/admin/login")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Za organizacije
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      <SubscriptionRequiredModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal}
      />
    </div>;
}