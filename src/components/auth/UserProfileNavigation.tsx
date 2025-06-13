
import { Button } from "@/components/ui/button";
import { Bell, Wallet, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileNavigationProps {
  onGoToProfile: (options?: { expandSection?: string }) => void;
  onSignOut: () => void;
}

export function UserProfileNavigation({ onGoToProfile, onSignOut }: UserProfileNavigationProps) {
  const navigationItems = [
    { label: "Obvestila", path: "#", icon: Bell, disabled: true },
    { label: "Moja naročnina", path: "/profile", icon: Wallet, options: { expandSection: "subscription" } },
    { label: "Nastavitve", path: "/profile", icon: User },
  ];

  return (
    <div className="border-t border-gray-200">
      <div className="p-2 grid grid-cols-1 gap-1">
        {navigationItems.map((item, index) => (
          <div key={index}>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-full justify-start text-left ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => item.options ? onGoToProfile(item.options) : onGoToProfile()}
              disabled={item.disabled}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          </div>
        ))}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Odjava
        </Button>
      </div>
    </div>
  );
}
