
import { SidebarUserProfile } from "./SidebarUserProfile";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarContentProps {
  isMobileMenu?: boolean;
}

export function SidebarContent({ isMobileMenu = false }: SidebarContentProps) {
  return (
    <div className={isMobileMenu ? "w-full" : ""}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold text-sm px-2">Profil uporabnika</h2>
          <SidebarUserProfile isMobileMenu={isMobileMenu} />
        </div>
        
        <div>
          <h2 className="font-bold text-sm px-2 mb-2">Meni</h2>
          <SidebarNavigation isMobileMenu={isMobileMenu} />
        </div>
        
        <div className={isMobileMenu ? "pt-2 border-t" : ""}>
          <SidebarFooter isMobileMenu={isMobileMenu} />
        </div>
      </div>
    </div>
  );
}
