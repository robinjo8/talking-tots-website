
import { User, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarUserProfileProps {
  isMobileMenu?: boolean;
}

export function SidebarUserProfile({ isMobileMenu = false }: SidebarUserProfileProps) {
  const { user, profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  
  const handleSelectChild = (index: number) => {
    try {
      setSelectedChildIndex(index);
      localStorage.setItem('selectedChildIndex', index.toString());
      
      // Close mobile sidebar after selection
      setOpenMobile(false);
      
      // Navigate to Moja Stran if not already there
      if (location.pathname !== '/moja-stran') {
        navigate('/moja-stran');
      }
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMobile(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-2">
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
      
      {profile?.children && profile.children.length > 0 && (
        <Accordion type="single" collapsible defaultValue="children" className="border-none">
          <AccordionItem value="children" className="border-none">
            <AccordionTrigger className="py-2 px-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Otroški profili</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-6 pt-1 pb-2">
              {profile.children.map((child, index) => (
                <div 
                  key={index}
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
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start text-left"
        onClick={() => handleNavigate("/profile")}
      >
        <User className="h-4 w-4 mr-2" />
        Uredi profil
      </Button>
    </div>
  );
}
