
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  const { setOpenMobile } = useSidebar();
  
  const handleNavigate = (path: string) => {
    setOpenMobile(false);
    onItemClick();
  };
  
  return (
    <ScrollArea className="h-[80vh]">
      <div className="px-4 py-6 flex flex-col">
        <AppSidebar isMobileMenu={true} />
        {!user && (
          <div className="mt-4 px-2 space-y-3">
            <Link to="/login" className="w-full" onClick={() => handleNavigate("/login")}>
              <Button variant="default" className="w-full">
                Prijava
              </Button>
            </Link>
            <Link to="/register" className="w-full" onClick={() => handleNavigate("/register")}>
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Registracija
              </Button>
            </Link>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
