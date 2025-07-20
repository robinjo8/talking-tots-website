import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Play, UserPlus, LogOut, Home, Activity, Gamepad, Award, Video, BookOpen, Bell, CreditCard, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSelector } from "./ProfileSelector";
import { Profile } from "@/contexts/AuthContext";
interface MobileMenuProps {
  user: any;
  profile: Profile | null;
  selectedChildIndex: number | null;
  selectedChild: any;
  onSelectChild: (index: number | null) => void;
  onSignOut: () => void;
  onStartNow: () => void;
  onCenikScroll: () => void;
}
export function MobileMenu({
  user,
  profile,
  selectedChildIndex,
  selectedChild,
  onSelectChild,
  onSignOut,
  onStartNow,
  onCenikScroll
}: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const getAvatarSrc = (avatarId: number): string => {
    const avatarImages = ["", "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"];
    return avatarImages[avatarId] || "";
  };
  const handleNavigate = (path: string, options?: {
    expandSection?: string;
  }) => {
    navigate(path);
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };
  return <div className="lg:hidden flex items-center gap-2">
      {/* Hamburger menu and child info aligned horizontally */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 w-80">
          <ScrollArea className="h-[90vh]">
            <div className="flex flex-col p-6 space-y-6">
              {/* Show Cenik only when NOT logged in */}
              {!user && <div className="flex flex-row items-center gap-2 pb-3">
                  <Button type="button" variant="default" className="font-semibold flex-1 h-12 rounded-full text-base w-full" onClick={onCenikScroll}>
                    Cenik
                  </Button>
                </div>}
              
              {user && <>
                  <ProfileSelector profile={profile} selectedChildIndex={selectedChildIndex} onSelectChild={onSelectChild} userEmail={user.email} />
                  
                  {/* Main navigation - custom order with Moja stran first */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigacija</h3>
                    
                    {/* Moja stran - FIRST */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/moja-stran') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/moja-stran')}>
                      <Home className="h-4 w-4 mr-2" />
                      Moja stran
                    </Button>
                    
                    {/* Vaje - SECOND */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/govorno-jezikovne-vaje') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/govorno-jezikovne-vaje')}>
                      <Activity className="h-4 w-4 mr-2" />
                      Vaje
                    </Button>
                    
                    {/* Igre - THIRD */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/govorne-igre') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/govorne-igre')}>
                      <Gamepad className="h-4 w-4 mr-2" />
                      Igre
                    </Button>
                    
                    {/* Izzivi - FOURTH */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/moji-izzivi') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/moji-izzivi')}>
                      <Award className="h-4 w-4 mr-2" />
                      Izzivi
                    </Button>
                    
                    {/* Video navodila - FIFTH */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/video-navodila') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/video-navodila')}>
                      <Video className="h-4 w-4 mr-2" />
                      Video navodila
                    </Button>
                    
                    {/* Logopedski nasveti - SIXTH */}
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/logopedski-koticek') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/logopedski-koticek')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Logopedski nasveti
                    </Button>
                  </div>
                  
                  {/* User menu items */}
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Račun</h3>
                    
                    <Button variant="ghost" className="w-full justify-start text-left h-12 opacity-50 cursor-not-allowed" disabled={true}>
                      <Bell className="h-4 w-4 mr-2" />
                      Obvestila
                    </Button>
                    
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/profile') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/profile', {
                  expandSection: 'subscription'
                })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Moja naročnina
                    </Button>
                    
                    <Button variant="ghost" className={`w-full justify-start text-left h-12 ${isActivePath('/profile') ? 'bg-accent' : ''}`} onClick={() => handleNavigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Nastavitve
                    </Button>
                    
                    <Button variant="outline" onClick={onSignOut} className="w-full justify-start text-left h-12 mt-4 text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Odjava
                    </Button>
                  </div>
                </>}
              
              {!user && <div className="flex flex-col gap-3">
                  <Button onClick={onStartNow} className="w-full h-12 rounded-full text-base bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold uppercase">
                    <Play className="h-4 w-4 mr-2" />
                    Začni zdaj
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold uppercase" onClick={() => navigate("/login")}>
                    Prijava
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold uppercase" onClick={() => navigate("/register")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registracija
                  </Button>
                </div>}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      {/* Show selected child next to hamburger menu */}
      {selectedChild && <div className="flex items-center gap-2">
          {selectedChild.avatarId > 0 && <Avatar className="h-6 w-6 border border-green-200">
              <AvatarImage src={getAvatarSrc(selectedChild.avatarId)} alt={selectedChild.name} className="object-contain" />
              <AvatarFallback className="bg-green-100 text-green-800">
                {selectedChild.name[0]}
              </AvatarFallback>
            </Avatar>}
          <span className="text-sm font-medium text-muted-foreground uppercase">
            {selectedChild.name}
          </span>
        </div>}
    </div>;
}