
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  
  return (
    <ScrollArea className="h-[80vh]">
      <div className="px-4 py-6 flex flex-col">
        <AppSidebar isMobileMenu={true} />
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
