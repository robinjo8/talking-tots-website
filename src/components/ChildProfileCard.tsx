
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, UserRound } from "lucide-react";

type ChildProfileProps = {
  child: {
    name: string;
    gender: string;
    avatarId: number;
  };
  isSelected: boolean;
  onSelect: () => void;
};

// Get avatar src by avatarId
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

export function ChildProfileCard({ child, isSelected, onSelect }: ChildProfileProps) {
  const avatarSrc = getAvatarSrc(child.avatarId);
  
  // Format gender display
  const formatGender = (gender: string) => {
    switch (gender) {
      case "M": return "Deček";
      case "Ž": return "Deklica";
      default: return "Ni določeno";
    }
  };

  return (
    <Card className={`overflow-hidden transition-colors ${
      isSelected 
        ? "border-dragon-green bg-dragon-green/5" 
        : "border-dragon-green/20 hover:border-dragon-green/50"
    }`}>
      <CardContent className="p-4 flex items-center gap-4">
        {child.avatarId === 0 ? (
          <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
            <UserRound className="h-8 w-8 text-gray-400" />
          </div>
        ) : (
          <Avatar className={`h-16 w-16 border ${isSelected ? "border-dragon-green" : "border-dragon-green/20"}`}>
            <AvatarImage src={avatarSrc} alt={`Avatar za ${child.name}`} className="object-contain" />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-grow">
          <h4 className="text-lg font-medium">{child.name}</h4>
          <p className="text-sm text-muted-foreground">{formatGender(child.gender)}</p>
        </div>
        
        <div>
          {isSelected ? (
            <div className="bg-dragon-green text-white rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSelect}
              className="border-dragon-green text-dragon-green hover:bg-dragon-green/10 hover:text-dragon-green"
            >
              Izberi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
