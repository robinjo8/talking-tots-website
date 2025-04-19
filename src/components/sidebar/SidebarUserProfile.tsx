
import { User, Users, Settings } from "lucide-react";
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
      
      // Navigate to Moja Stran if not already there
      if (location.pathname !== '/moja-stran') {
        navigate('/moja-stran');
      }
      setOpenMobile(false);
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMobile(false);
  };

  if (!user) return null;

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="font-bold text-sm px-2">Profil uporabnika</h2>
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
      </div>
      
      {profile?.children && profile.children.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-sm px-2">Otroški profil</h2>
          <Accordion type="single" collapsible defaultValue="children" className="border-none">
            <AccordionItem value="children" className="border-none">
              <AccordionContent className="pl-2 pt-1 pb-2">
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
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start text-left"
        onClick={() => handleNavigate("/profile")}
      >
        <Settings className="h-4 w-4 mr-2" />
        Nastavitve
      </Button>
    </div>
  );
}
