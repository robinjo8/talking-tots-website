
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/auth/UserProfile";
import { BookText, ChevronDown, UserRound } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, signOut, profile, setSelectedChildIndex, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to get the selected child from localStorage on initial load
  useEffect(() => {
    // Only run this if we don't have a selected child index yet
    if (selectedChildIndex === null && profile?.children && profile.children.length > 0) {
      const storedIndex = localStorage.getItem('selectedChildIndex');
      if (storedIndex !== null) {
        setSelectedChildIndex(parseInt(storedIndex, 10));
      } else {
        setSelectedChildIndex(0);
      }
    }
  }, [profile?.children, selectedChildIndex, setSelectedChildIndex]);
  
  // Select active child
  const handleChildSelect = async (index: number) => {
    try {
      setSelectedChildIndex(index);
      localStorage.setItem('selectedChildIndex', index.toString());
      
      // Navigate to Moja Stran if not already there
      if (location.pathname !== '/moja-stran') {
        navigate('/moja-stran');
      }
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

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
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="font-medium hover:text-dragon-green transition-colors">Funkcije</a>
            <a href="#cta" className="font-medium hover:text-dragon-green transition-colors">Začni</a>
            {user && (
              <Link to="/moja-stran" className="font-medium hover:text-dragon-green transition-colors flex items-center gap-1">
                <BookText className="h-4 w-4" />
                Moja stran
              </Link>
            )}
          </nav>
          
          {user && profile?.children && profile.children.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2 text-sm border-dragon-green/30 bg-dragon-green/5 text-dragon-green hover:bg-dragon-green/10 hover:text-dragon-green flex items-center gap-1"
                >
                  <UserRound className="h-3.5 w-3.5 mr-1" />
                  {selectedChild ? selectedChild.name : "Izberi otroka"}
                  <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                {profile.children.map((child, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className={`cursor-pointer ${selectedChildIndex === index ? 'bg-dragon-green/10 font-medium text-dragon-green' : ''}`}
                    onClick={() => handleChildSelect(index)}
                  >
                    {child.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
