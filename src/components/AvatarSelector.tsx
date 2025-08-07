
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

// Avatar options for children
export const avatarOptions = [
  { id: 0, src: "", alt: "Brez avatarja" },
  { id: 1, src: "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", alt: "Zmajček s srčastimi očali" },
  { id: 2, src: "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", alt: "Zmajček s knjigo" },
  { id: 3, src: "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", alt: "Zmajček s slušalkami" },
  { id: 4, src: "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", alt: "Zmajček z rumeno kapo" },
  { id: 5, src: "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", alt: "Zmajček z rumeno knjigo" },
  { id: 6, src: "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", alt: "Zmajček s pentljo" },
  { id: 7, src: "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", alt: "Zmajček z oranžnimi očali" },
  { id: 8, src: "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", alt: "Zmajček z rumenimi slušalkami" },
  { id: 9, src: "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", alt: "Zmajček s paleto in čopičem" },
  { id: 10, src: "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", alt: "Zmajček s srčastimi očali" },
  { id: 11, src: "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", alt: "Zmajček z rdečo knjigo" },
  { id: 12, src: "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", alt: "Zmajček z mikrofonom" },
  { id: 13, src: "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", alt: "Zmajček z očali" },
  { id: 14, src: "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", alt: "Zmajček z rdečo kapo" },
  { id: 15, src: "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png", alt: "Zmajček z žogo" },
];

type AvatarSelectorProps = {
  selectedAvatarId: number;
  onAvatarSelect: (id: number) => void;
  variant?: 'grid' | 'dropdown';
};

export function AvatarSelector({ selectedAvatarId, onAvatarSelect, variant = 'grid' }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Grid variant (original design for registration)
  if (variant === 'grid') {
    return (
      <div className="w-full">
        <Label className="text-base font-medium mb-4 block">Izberi avatarja</Label>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 p-6 bg-gray-50/50 rounded-xl border">
          {avatarOptions.map(avatar => (
            <div 
              key={avatar.id}
              onClick={() => onAvatarSelect(avatar.id)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 flex flex-col items-center justify-center min-h-[120px] hover:shadow-lg ${
                selectedAvatarId === avatar.id 
                  ? 'bg-dragon-green/20 ring-3 ring-dragon-green shadow-xl scale-[1.02]' 
                  : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-dragon-green/40'
              }`}
            >
              {avatar.id === 0 ? (
                <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-300 mb-2">
                  <UserX className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  <span className="sr-only">{avatar.alt}</span>
                </div>
              ) : (
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ring-2 ring-transparent">
                    <AvatarImage 
                      src={avatar.src} 
                      alt={avatar.alt} 
                      className="object-contain w-full h-full p-1" 
                    />
                    <AvatarFallback className="text-xs text-center p-1 bg-dragon-green/10">
                      🐲
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <span className="text-xs text-center text-gray-600 mt-2 leading-tight max-w-full break-words">
                {avatar.id === 0 ? "Brez" : `Zmajček ${avatar.id}`}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => onAvatarSelect(0)}
            className="w-full"
          >
            Ne želim izbrati avatarja
          </Button>
        </div>
      </div>
    );
  }

  // Dropdown variant (new design for profile editing)
  return (
    <div className="w-full">
      <Label className="text-base font-medium mb-2 block">Izberi avatarja</Label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-dragon-green/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedAvatarId === 0 ? (
              <>
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300">
                  <UserX className="h-5 w-5 text-gray-400" />
                </div>
                <span className="text-gray-600">Brez avatarja</span>
              </>
            ) : (
              <>
                <Avatar className="h-10 w-10 ring-2 ring-dragon-green/20">
                  <AvatarImage 
                    src={avatarOptions.find(a => a.id === selectedAvatarId)?.src} 
                    alt="Izbrani avatar" 
                    className="object-contain" 
                  />
                  <AvatarFallback className="text-xs bg-dragon-green/10">🐲</AvatarFallback>
                </Avatar>
                <span className="text-gray-700">Izbrani avatar</span>
              </>
            )}
          </div>
          <svg 
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {avatarOptions.slice(1).map(avatar => (
                <div 
                  key={avatar.id}
                  onClick={() => {
                    onAvatarSelect(avatar.id);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg p-3 transition-all duration-200 flex items-center justify-center min-h-[80px] hover:shadow-lg border-2 ${
                    selectedAvatarId === avatar.id 
                      ? 'bg-dragon-green/20 ring-2 ring-dragon-green shadow-xl border-dragon-green' 
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-dragon-green/40'
                  }`}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-transparent">
                    <AvatarImage 
                      src={avatar.src} 
                      alt={avatar.alt} 
                      className="object-contain w-full h-full p-1" 
                    />
                    <AvatarFallback className="text-xs bg-dragon-green/10">🐲</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => {
                onAvatarSelect(0);
                setIsOpen(false);
              }}
              className="w-full"
            >
              Ne želim izbrati avatarja
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
