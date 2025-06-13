
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarSrc } from "@/utils/avatarUtils";

interface ProfileSelectorProps {
  onSelectChild: (index: number | null) => void;
}

export function ProfileSelector({ onSelectChild }: ProfileSelectorProps) {
  const { user, profile, selectedChildIndex } = useAuth();

  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  return (
    <div className="p-4 bg-blue-50 border-b border-gray-200">
      <div className="text-base font-semibold">Izberi profil</div>
      <div className="text-xs text-gray-500 mt-1">
        Preklapljaj med starševskim in otroškim profilom
      </div>
      
      <div className="mt-4 space-y-2">
        {/* Parent profile */}
        <div 
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
            selectedChildIndex === null ? 'bg-blue-50' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectChild(null)}
        >
          <Avatar className="h-8 w-8 border border-blue-200">
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {profile?.username?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{profile?.username || user?.email}</div>
            <div className="flex items-center">
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">starš</span>
            </div>
          </div>
          {selectedChildIndex === null && (
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          )}
        </div>
        
        {/* Children profiles section */}
        {profile?.children && profile.children.length > 0 && (
          <div className="mt-2">
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Otroški profili</span>
            </div>
            <div className="mt-1 bg-green-50 rounded-md overflow-hidden">
              {profile.children.map((child, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 cursor-pointer ${
                    selectedChildIndex === index ? 'bg-green-100' : 'hover:bg-green-100/50'
                  }`}
                  onClick={() => onSelectChild(index)}
                >
                  <Avatar className="h-8 w-8 border border-green-200">
                    {child.avatarId > 0 ? (
                      <AvatarImage 
                        src={getAvatarSrc(child.avatarId)} 
                        alt={child.name} 
                        className="object-contain" 
                      />
                    ) : (
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {child.name[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm flex-1">{child.name}</span>
                  {selectedChildIndex === index && (
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
