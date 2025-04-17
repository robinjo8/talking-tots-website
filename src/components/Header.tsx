
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { BookText, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
            alt="Tomi the Dragon" 
            className="h-8 md:h-10"
          />
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
            <span className="text-2xl font-extrabold text-app-orange">Talk</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {isMobile ? (
            <MobileMenu />
          ) : (
            <nav className="flex gap-6">
              <a href="#features" className="font-medium hover:text-dragon-green transition-colors">Funkcije</a>
              <a href="#cta" className="font-medium hover:text-dragon-green transition-colors">Začni</a>
              {user && (
                <Link to="/moja-stran" className="font-medium hover:text-dragon-green transition-colors flex items-center gap-1">
                  <BookText className="h-4 w-4" />
                  Moja stran
                </Link>
              )}
            </nav>
          )}
          
          {user ? (
            <UserProfile />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-sm">
                  Prijava
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const { user, signOut, selectedChildIndex, profile } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Meni</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="py-4">
          <div className="px-2 py-3 mb-2 border-b">
            <h2 className="text-lg font-semibold mb-4">Meni</h2>
            
            <nav className="space-y-2">
              <a 
                href="#features" 
                className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                Funkcije
              </a>
              <a 
                href="#cta" 
                className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                Začni
              </a>
              
              {user && (
                <Link 
                  to="/moja-stran" 
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
                >
                  <BookText className="h-4 w-4 mr-2" />
                  Moja stran
                </Link>
              )}
            </nav>
          </div>
          
          {user && (
            <div className="px-2 py-3">
              <Link 
                to="/profile" 
                className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                Profil
              </Link>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                Odjava
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
