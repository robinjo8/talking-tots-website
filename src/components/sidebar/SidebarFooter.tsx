
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface SidebarFooterProps {
  isMobileMenu?: boolean;
}

export function SidebarFooter({ isMobileMenu = false }: SidebarFooterProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      console.log("SidebarFooter: Attempting to sign out");
      await signOut();
      setOpenMobile(false);
      navigate("/login");
    } catch (error) {
      console.error("SidebarFooter: Error during sign out:", error);
      toast.error("Napaka pri odjavi");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full justify-start text-left"
      onClick={handleSignOut}
      disabled={isLoggingOut}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? "Odjavljanje..." : "Odjava"}
    </Button>
  );
}
