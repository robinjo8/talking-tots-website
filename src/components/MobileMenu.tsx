
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BookText, User, Users, ChevronDown } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    onItemClick();
    navigate("/login");
  };
  
  const handleSelectChild = (index: number) => {
    try {
      setSelectedChildIndex(index);
      localStorage.setItem('selectedChildIndex', index.toString());
      onItemClick();
      navigate('/moja-stran');
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };
  
  const handleSelectParent = () => {
    setSelectedChildIndex(null);
    localStorage.removeItem('selectedChildIndex');
    onItemClick();
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    onItemClick();
  };
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
  
  return (
    <div className="px-4 py-6 h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Meni</h2>
        <DrawerClose />
      </div>
      
      <nav className="space-y-3 flex-1">
        <DrawerClose asChild>
          <a 
            href="#features" 
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
            onClick={onItemClick}
          >
            Funkcije
          </a>
        </DrawerClose>
        
        <DrawerClose asChild>
          <a 
            href="#cta" 
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
            onClick={onItemClick}
          >
            Začni
          </a>
        </DrawerClose>
        
        {user && (
          <DrawerClose asChild>
            <Link 
              to="/moja-stran" 
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent"
              onClick={onItemClick}
            >
              <BookText className="h-4 w-4 mr-2" />
              Moja stran
            </Link>
          </DrawerClose>
        )}
      </nav>
      
      {user && (
        <div className="mt-auto pt-4 border-t">
          <div className="mb-4">
            <DrawerClose asChild>
              <div 
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
                onClick={() => handleNavigate("/profile")}
              >
                <User className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{profile?.username || user.email}</div>
                  <div className="text-xs text-muted-foreground">Starš</div>
                </div>
              </div>
            </DrawerClose>
            
            {profile?.children && profile.children.length > 0 && (
              <Accordion type="single" collapsible defaultValue="children" className="mt-2">
                <AccordionItem value="children" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Otroški profili</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pt-1 pb-2">
                    {profile.children.map((child, index) => (
                      <DrawerClose key={index} asChild>
                        <div 
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                            selectedChildIndex === index ? 'bg-dragon-green/10 text-dragon-green' : 'hover:bg-muted'
                          }`}
                          onClick={() => handleSelectChild(index)}
                        >
                          <span className="text-sm">{child.name}</span>
                          {selectedChildIndex === index && (
                            <div className="h-2 w-2 rounded-full bg-dragon-green ml-auto"></div>
                          )}
                        </div>
                      </DrawerClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
          
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left"
              onClick={() => handleNavigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Uredi profil
            </Button>
          </DrawerClose>
          
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left mt-2"
              onClick={handleSignOut}
            >
              Odjava
            </Button>
          </DrawerClose>
        </div>
      )}
    </div>
  );
}
