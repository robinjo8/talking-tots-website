import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, 
  User, 
  Sparkles, 
  Home, 
  BookText, 
  LogOut,
  ChevronDown 
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  isMobileMenu?: boolean;
}

export function AppSidebar({ isMobileMenu = false }: AppSidebarProps) {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSignOut = async () => {
    await signOut();
    setOpenMobile(false);
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMobile(false);
  };

  const handleAnchorNavigate = (path: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpenMobile(false);
  };
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  // Only render the sidebar for mobile or if explicitly declared as mobile menu
  if (!isMobileMenu) {
    return (
      <Sidebar variant="inset">
        {/* Content only for mobile sidebar */}
        <SidebarHeader className="border-b">
          <div className="flex items-center p-2">
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-7 w-7 mr-2"
            />
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
              <span className="text-xl font-extrabold text-app-orange">Talk</span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          {user && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-bold text-sm">
                Profil uporabnika
              </SidebarGroupLabel>
              <SidebarGroupContent>
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
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm">Meni</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => handleAnchorNavigate("#features")}
                    tooltip="Funkcije"
                  >
                    <Sparkles className="text-dragon-green" />
                    <span>Funkcije</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => handleAnchorNavigate("#cta")}
                    tooltip="Začni"
                  >
                    <Home className="text-app-orange" />
                    <span>Začni</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {user && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigate("/moja-stran")}
                      tooltip="Moja stran"
                    >
                      <BookText className="text-dragon-green" />
                      <span>Moja stran</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        {user && (
          <SidebarFooter className="border-t p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </SidebarFooter>
        )}
      </Sidebar>
    );
  }
  
  // For mobile menu display full content
  return (
    <div className="w-full">
      <div className="space-y-6">
        {user && (
          <div className="space-y-2">
            <h2 className="font-bold text-sm px-2">Profil uporabnika</h2>
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
          </div>
        )}
        
        <div>
          <h2 className="font-bold text-sm px-2 mb-2">Meni</h2>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left"
              onClick={() => handleAnchorNavigate("#features")}
            >
              <Sparkles className="h-4 w-4 mr-2 text-dragon-green" />
              Funkcije
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left"
              onClick={() => handleAnchorNavigate("#cta")}
            >
              <Home className="h-4 w-4 mr-2 text-app-orange" />
              Začni
            </Button>
            
            {user && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left"
                onClick={() => handleNavigate("/moja-stran")}
              >
                <BookText className="h-4 w-4 mr-2 text-dragon-green" />
                Moja stran
              </Button>
            )}
          </div>
        </div>
        
        {user && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-left"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
