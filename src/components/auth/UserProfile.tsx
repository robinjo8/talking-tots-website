
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRound, ChevronDown, User, Users } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function UserProfile() {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSelectChild = (index: number) => {
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

  const handleSelectParent = () => {
    setSelectedChildIndex(null);
    localStorage.removeItem('selectedChildIndex');
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  if (!user) {
    return null;
  }

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-dragon-green/10 border border-dragon-green/30 rounded-full cursor-pointer hover:bg-dragon-green/20 transition-all duration-200"
          >
            <UserRound className="h-4 w-4 text-dragon-green" />
            <span className="text-sm font-medium text-dragon-green">
              {selectedChild ? selectedChild.name : profile?.username || user.email}
            </span>
            <ChevronDown className="h-3 w-3 text-dragon-green" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end" sideOffset={4}>
          <div className="p-3 bg-gradient-to-r from-dragon-green/10 to-app-blue/10 border-b">
            <div className="font-medium">Izberi profil</div>
            <div className="text-xs text-muted-foreground mt-1">
              Preklapljaj med starševskim in otroškim profilom
            </div>
          </div>
          
          <div className="p-2">
            <div 
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedChildIndex === null ? 'bg-dragon-green/10 text-dragon-green' : 'hover:bg-muted'
              }`}
              onClick={handleGoToProfile}
            >
              <User className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{profile?.username || user.email}</div>
                <div className="text-xs text-muted-foreground">Starš</div>
              </div>
              {selectedChildIndex === null && (
                <div className="h-2 w-2 rounded-full bg-dragon-green"></div>
              )}
            </div>
            
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
          </div>
          
          <div className="border-t p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Uredi profil
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left mt-1"
              onClick={handleSignOut}
            >
              Odjava
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
