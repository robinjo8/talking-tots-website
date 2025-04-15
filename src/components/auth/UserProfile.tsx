
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { user, profile } = useAuth();
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
      <div className="text-sm">
        <span className="block font-medium">{profile?.username || user.email}</span>
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

