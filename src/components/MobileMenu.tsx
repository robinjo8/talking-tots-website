
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  
  return (
    <ScrollArea className="h-[80vh]">
      <div className="px-4 py-6 flex flex-col">
        <div className="pb-4">
          <h3 className="font-semibold mb-2">Menu</h3>
          <nav className="space-y-2">
            {user && (
              <>
                <Link to="/moja-stran" className="block px-2 py-1 hover:text-dragon-green">
                  Moja stran
                </Link>
                <Link to="/govorno-jezikovne-vaje" className="block px-2 py-1 hover:text-dragon-green">
                  Vaje
                </Link>
                <Link to="/govorne-igre" className="block px-2 py-1 hover:text-dragon-green">
                  Govorne igre
                </Link>
                <Link to="/moji-izzivi" className="block px-2 py-1 hover:text-dragon-green">
                  Izzivi
                </Link>
                <Link to="/video-navodila" className="block px-2 py-1 hover:text-dragon-green">
                  Video navodila
                </Link>
              </>
            )}
          </nav>
        </div>
        {!user && (
          <div className="mt-4 px-2">
            <Link to="/login" className="w-full">
              <Button variant="default" className="w-full">
                Prijava
              </Button>
            </Link>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
