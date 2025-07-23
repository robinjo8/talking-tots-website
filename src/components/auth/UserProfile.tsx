
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, Users, Bell, Wallet, LogOut, Menu } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserProfile() {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSelectChild = (index: number) => {
    try {
      setSelectedChildIndex(index);
      localStorage.setItem('selectedChildIndex', index.toString());
      
      // Navigate to Moja Stran if not already there
      if (location.pathname !== '/moja-stran') {
        navigate('/moja-stran');
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

  // Function to get child avatar source based on avatarId
  const getAvatarSrc = (avatarId: number): string => {
    const avatarImages = [
      "",
      "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png",
      "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png",
      "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png",
      "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png",
      "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png",
      "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png",
      "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png",
      "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png",
      "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png",
      "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png",
      "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png",
      "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png",
      "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png",
      "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png",
      "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"
    ];
  
    return avatarImages[avatarId] || "";
  };

  // Updated navigation items - removed the main navigation items
  const navigationItems = [
    { label: "Obvestila", path: "#", icon: Bell, disabled: true },
    { label: "Moja naročnina", path: "/profile", icon: Wallet, options: { expandSection: "subscription" } },
    { label: "Nastavitve", path: "/profile", icon: User },
  ];

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm h-12 lg:h-14"
          >
            {selectedChild && selectedChild.avatarId > 0 ? (
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border border-green-200">
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
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border border-gray-200">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                  {profile?.username?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-base lg:text-lg font-semibold lg:uppercase">
              {selectedChild ? selectedChild.name.toUpperCase() : profile?.username || user.email}
            </span>
            <Menu className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 shadow-lg border-gray-200 bg-blue-50/30" align="end" sideOffset={4}>
          <div className="p-3">
            {/* Parent profile */}
            <div 
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedChildIndex === null ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setSelectedChildIndex(null);
                localStorage.removeItem('selectedChildIndex');
              }}
            >
              <Avatar className="h-8 w-8 border border-blue-200">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {profile?.username?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-base uppercase">{profile?.username || user.email}</div>
                <div className="flex items-center">
                  <span className="text-sm px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded uppercase">starš</span>
                </div>
              </div>
              {selectedChildIndex === null && (
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              )}
            </div>
            
            {/* Children profiles section */}
            {profile?.children && profile.children.length > 0 && (
              <div className="mt-2">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-500 flex items-center gap-1 uppercase">
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
                      onClick={() => handleSelectChild(index)}
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
                      <span className="text-base flex-1 uppercase">{child.name}</span>
                      {selectedChildIndex === index && (
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation items - removed the main navigation items */}
          <div className="border-t border-gray-200">
            <div className="p-2 grid grid-cols-1 gap-1">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-full justify-start text-left uppercase ${
                      item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => item.options ? handleGoToProfile(item.options) : navigate(item.path)}
                    disabled={item.disabled}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span className="text-base">{item.label}</span>
                  </Button>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50 uppercase"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-base">Odjava</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
