import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "@/components/MobileMenu";
export default function Header() {
  const {
    user,
    profile,
    selectedChildIndex
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    setOpenMobile
  } = useSidebar();
  const selectedChild = selectedChildIndex !== null && profile?.children ? profile.children[selectedChildIndex] : null;
  return <header className="py-4 px-6 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" alt="Tomi the Dragon" className="h-8 md:h-10" />
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange">Talk</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {isMobile ? <div className="flex items-center gap-4 mx-0 px-[52px]">
              {selectedChild && <div className="text-xs text-muted-foreground bg-light-cloud dark:bg-dark-cloud px-3 py-1 rounded-full truncate max-w-[150px]">
                  Profil: <span className="font-medium text-dragon-green ml-1">{selectedChild.name}</span>
                </div>}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Menu className="h-4 w-4" />
                    <span>Meni</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <MobileMenu onItemClick={() => {}} />
                </SheetContent>
              </Sheet>
            </div> : <>
              <nav className="flex items-center gap-6">
                <a href="#features" className="font-medium hover:text-dragon-green transition-colors">Funkcije</a>
                <a href="#cta" className="font-medium hover:text-dragon-green transition-colors">Začni</a>
                {user && <Link to="/moja-stran" className="font-medium hover:text-dragon-green transition-colors flex items-center gap-1">
                    Moja stran
                  </Link>}
                
                {user ? <UserProfile /> : <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="text-sm">
                        Prijava
                      </Button>
                    </Link>
                  </div>}
              </nav>
            </>}
        </div>
      </div>
    </header>;
}