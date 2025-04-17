
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  User, 
  Users, 
  LogOut, 
  BookText, 
  Play, 
  Function, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  const handleSelectChild = (index: number) => {
    try {
      setSelectedChildIndex(index);
      localStorage.setItem('selectedChildIndex', index.toString());
      navigate('/moja-stran');
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-8"
            />
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
              <span className="text-xl font-extrabold text-app-orange">Talk</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold mb-2">
            Meni
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#features" className="flex items-center gap-2">
                    <Function className="h-4 w-4" />
                    <span>Funkcije</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#cta" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span>Začni</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/moja-stran" className="flex items-center gap-2">
                      <BookText className="h-4 w-4" />
                      <span>Moja stran</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-base font-semibold mb-2">
              Profil uporabnika
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 mb-4">
                <div 
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{profile?.username || user.email}</div>
                    <div className="text-xs text-muted-foreground">Starš</div>
                  </div>
                </div>
                
                {profile?.children && profile.children.length > 0 && (
                  <Collapsible open={isChildrenOpen} onOpenChange={setIsChildrenOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 text-left rounded-md hover:bg-muted">
                      <Users className="h-4 w-4" />
                      <span className="flex-1 text-sm font-medium">Otroški profili</span>
                      {isChildrenOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pt-1 pb-2">
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
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Uredi profil
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      {user && (
        <SidebarFooter className="border-t p-4">
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
