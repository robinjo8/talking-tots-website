
import { 
  Sidebar, 
  SidebarContent as SidebarContainer, 
  SidebarFooter as SidebarFooterContainer, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  useSidebar 
} from "@/components/ui/sidebar";
import { SidebarContent } from "@/components/sidebar/SidebarContent";

interface AppSidebarProps {
  isMobileMenu?: boolean;
}

export function AppSidebar({ isMobileMenu = false }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  
  // For mobile menu display full content
  if (isMobileMenu) {
    return <SidebarContent isMobileMenu={true} />;
  }
  
  // Only render the sidebar for non-mobile
  return (
    <Sidebar variant="inset">
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
      
      <SidebarContainer>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-sm">
            Profil uporabnika
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarContent />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContainer>
    </Sidebar>
  );
}
