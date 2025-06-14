
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileSelector } from "./ProfileSelector";
import { UserProfileNavigation } from "./UserProfileNavigation";
import { getAvatarSrc } from "@/utils/avatarUtils";

export function UserProfile() {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSelectChild = (index: number | null) => {
    try {
      setSelectedChildIndex(index);
      if (index !== null) {
        localStorage.setItem('selectedChildIndex', index.toString());
      } else {
        localStorage.removeItem('selectedChildIndex');
      }
    } catch (error) {
      console.error("Napaka pri izbiri otroka:", error);
    }
  };

  const handleGoToProfile = (options?: { expandSection?: string }) => {
    navigate("/profile", { state: options });
    if (options?.expandSection) {
      localStorage.setItem('expandSection', options.expandSection);
    }
  };

  if (!user) {
    return null;
  }

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            {selectedChild && selectedChild.avatarId > 0 ? (
              <Avatar className="h-6 w-6 border border-green-200">
                <AvatarImage 
                  src={getAvatarSrc(selectedChild.avatarId)} 
                  alt={selectedChild.name} 
                  className="object-contain" 
                />
                <AvatarFallback className="bg-green-100 text-green-800">
                  {selectedChild.name[0]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-6 w-6 border border-gray-200">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                  {profile?.username?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-sm font-medium">
              {selectedChild ? selectedChild.name : profile?.username || user.email}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 shadow-lg border-gray-200" align="end" sideOffset={4}>
          <ProfileSelector onSelectChild={handleSelectChild} />
          <UserProfileNavigation onGoToProfile={handleGoToProfile} onSignOut={handleSignOut} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
