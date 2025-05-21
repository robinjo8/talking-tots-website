
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SidebarFooterProps {
  isMobileMenu?: boolean;
}

export function SidebarFooter({ isMobileMenu = false }: SidebarFooterProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOut();
      setOpenMobile(false);
      navigate("/login");
    } catch (error) {
      console.error("Error in SidebarFooter handleSignOut:", error);
    }
  };

  if (!user) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full justify-start text-left"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Odjava
    </Button>
  );
}
