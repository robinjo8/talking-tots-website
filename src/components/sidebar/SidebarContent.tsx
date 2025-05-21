
import { SidebarUserProfile } from "./SidebarUserProfile";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarContentProps {
  isMobileMenu?: boolean;
}

export function SidebarContent({ isMobileMenu = false }: SidebarContentProps) {
  const { user } = useAuth();
  
  return (
    <div className={isMobileMenu ? "w-full" : ""}>
      <div className="space-y-6">
        {/* Only show user profile if logged in */}
        {(user || !isMobileMenu) && (
          <SidebarUserProfile isMobileMenu={isMobileMenu} />
        )}
        
        {/* Only show navigation menu if logged in on mobile */}
        {(user || !isMobileMenu) && (
          <div>
            <h2 className="font-bold text-sm px-2 mb-2">Meni</h2>
            <SidebarNavigation isMobileMenu={isMobileMenu} />
          </div>
        )}
        
        {/* Show footer for all users */}
        <div className={isMobileMenu ? "pt-2 border-t" : ""}>
          <SidebarFooter isMobileMenu={isMobileMenu} />
        </div>
      </div>
    </div>
  );
}
