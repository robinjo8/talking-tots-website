
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const navigationItems = [
    { label: "Moja stran", path: "/moja-stran" },
    { label: "Vaje", path: "/govorno-jezikovne-vaje" },
    { label: "Govorne igre", path: "/govorne-igre" },
    { label: "Izzivi", path: "/moji-izzivi" },
    { label: "Video navodila", path: "/video-navodila" },
  ];
  
  const handleNavigate = (path: string) => {
    navigate(path);
    onItemClick();
  };
  
  return (
    <div className="px-4 py-6 h-[80vh] flex flex-col">
      {user && (
        <div className="space-y-4 mb-6">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
      
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
  );
}
