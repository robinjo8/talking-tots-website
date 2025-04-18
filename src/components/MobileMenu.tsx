
import { Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  return (
    <div className="px-4 py-6 h-[80vh] flex flex-col">
      <AppSidebar isMobileMenu={true} />
      <div className="mt-4 px-2">
        <Link to="/login" className="w-full">
          <Button variant="default" className="w-full">
            Prijava
          </Button>
        </Link>
      </div>
    </div>
  );
}
