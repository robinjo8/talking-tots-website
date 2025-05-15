
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user has admin role
  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking admin role:", error);
        }
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    }
    
    checkAdminRole();
  }, [user]);
  
  return (
    <ScrollArea className="h-[80vh]">
      <div className="px-4 py-6 flex flex-col">
        <div className="pb-4">
          <h3 className="font-semibold mb-2">Menu</h3>
          <nav className="space-y-2">
            {user && (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                    Admin Portal
                  </Link>
                )}
                <Link to="/moja-stran" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                  Moja stran
                </Link>
                <Link to="/govorno-jezikovne-vaje" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                  Vaje
                </Link>
                <Link to="/govorne-igre" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                  Govorne igre
                </Link>
                <Link to="/moji-izzivi" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                  Izzivi
                </Link>
                <Link to="/video-navodila" className="block px-2 py-1 hover:text-dragon-green" onClick={onItemClick}>
                  Video navodila
                </Link>
              </>
            )}
          </nav>
        </div>
        {!user && (
          <div className="mt-4 px-2">
            <Link to="/login" className="w-full">
              <Button variant="default" className="w-full" onClick={onItemClick}>
                Prijava
              </Button>
            </Link>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
