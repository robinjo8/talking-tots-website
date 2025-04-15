
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export function UserWelcome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div 
      className="flex items-center gap-2 bg-gradient-to-r from-dragon-green/20 to-app-blue/20 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 border border-dragon-green/30"
      onClick={() => navigate("/profile")}
    >
      <User className="h-5 w-5 text-dragon-green" />
      <div className="text-sm">
        <span className="text-muted-foreground">Pozdravljen,</span>
        <span className="ml-1 font-semibold text-dragon-green">{profile?.username || user.email}</span>
      </div>
    </div>
  );
}
