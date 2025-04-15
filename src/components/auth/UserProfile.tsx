
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";

export function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div 
        className="flex items-center gap-2 px-3 py-1.5 bg-dragon-green/10 border border-dragon-green/30 rounded-full cursor-pointer hover:bg-dragon-green/20 transition-all duration-200"
        onClick={() => navigate("/profile")}
      >
        <UserRound className="h-4 w-4 text-dragon-green" />
        <span className="text-sm font-medium text-dragon-green">
          {profile?.username || user.email}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        className="text-xs"
      >
        Odjava
      </Button>
    </div>
  );
}
