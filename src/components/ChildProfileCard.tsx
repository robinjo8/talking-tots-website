import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, UserRound, Pencil, Trash2, FileEdit } from "lucide-react";
import { SpeechDifficultiesList } from "@/components/SpeechDifficultiesList";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type ChildProfileProps = {
  child: {
    name: string;
    gender: string;
    avatarId: number;
    speechDifficulties?: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onEditDifficulties?: () => void;
  hideActions?: boolean;
  minimal?: boolean;
};

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

export function ChildProfileCard({ 
  child, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete,
  onEditDifficulties,
  hideActions = false,
  minimal = false
}: ChildProfileProps) {
  const avatarSrc = getAvatarSrc(child.avatarId);
  const [isHovered, setIsHovered] = useState(false);
  
  const formatGender = (gender: string) => {
    switch (gender) {
      case "M": return "Deček";
      case "Ž": return "Deklica";
      default: return "Ni določeno";
    }
  };

  if (minimal) {
    return (
      <Card className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg ${
        isSelected 
          ? "border-dragon-green bg-gradient-to-br from-dragon-green/5 to-dragon-green/10" 
          : "border-dragon-green/20 hover:border-dragon-green/60 bg-white"
      } rounded-xl`}>
        <CardContent className="p-4 flex items-center gap-4">
          {child.avatarId === 0 ? (
            <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 border-2 transition-all duration-300 ${
              isSelected ? "border-dragon-green" : "border-gray-200"
            }`}>
              <UserRound className="h-6 w-6 text-gray-400" />
            </div>
          ) : (
            <Avatar className={`h-12 w-12 border-2 transition-all duration-300 ${
              isSelected ? "border-dragon-green" : "border-dragon-green/20"
            }`}>
              <AvatarImage src={avatarSrc} alt={`Avatar za ${child.name}`} className="object-contain" />
              <AvatarFallback className="bg-gradient-to-br from-app-blue/20 to-app-purple/20">
                {child.name[0]}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className="flex-grow">
            <h4 className={`font-medium transition-all duration-300 ${
              isSelected ? "text-dragon-green" : ""
            }`}>
              {child.name}
            </h4>
          </div>
          
          {isSelected && (
            <div className="ml-auto bg-dragon-green text-white rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg ${
        isSelected 
          ? "border-dragon-green bg-gradient-to-br from-dragon-green/5 to-dragon-green/10" 
          : "border-dragon-green/20 hover:border-dragon-green/60 bg-white"
      } rounded-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header with avatar, name and gender */}
        <div className="flex items-center gap-4">
          {child.avatarId === 0 ? (
            <div className={`h-20 w-20 rounded-full flex items-center justify-center bg-gray-100 border-2 transition-all duration-300 ${
              isSelected ? "border-dragon-green animate-pulse" : "border-gray-200"
            }`}>
              <UserRound className="h-10 w-10 text-gray-400" />
            </div>
          ) : (
            <Avatar className={`h-20 w-20 border-2 transition-all duration-300 ${
              isSelected ? "border-dragon-green animate-bounce-gentle" : "border-dragon-green/20"
            }`}>
              <AvatarImage 
                src={avatarSrc} 
                alt={`Avatar za ${child.name}`} 
                className="object-contain" 
              />
              <AvatarFallback 
                className="bg-gradient-to-br from-app-blue/20 to-app-purple/20 text-lg font-bold"
              >
                {child.name[0]}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div>
            <h4 className={`text-xl font-medium transition-all duration-300 ${
              isSelected ? "text-dragon-green" : ""
            }`}>
              {child.name}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${
                child.gender === "M" ? "bg-app-blue" : 
                child.gender === "Ž" ? "bg-app-orange" : 
                "bg-gray-400"
              }`}></span>
              {formatGender(child.gender)}
            </p>
          </div>
          
          {isSelected && (
            <div className="ml-auto bg-dragon-green text-white rounded-full p-1.5 animate-scale-in">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>
        
        {/* Action buttons - vertical layout */}
        {!hideActions && (
          <div className="flex flex-col space-y-2 animate-fade-in">
            {!isSelected && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onSelect}
                className="w-full border-dragon-green text-dragon-green hover:bg-dragon-green/10 hover:text-dragon-green transition-all duration-300"
              >
                <Check className="h-4 w-4 mr-2" />
                Izberi
              </Button>
            )}
            
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
                className="w-full border-app-blue text-app-blue hover:bg-app-blue/10 hover:text-app-blue transition-all duration-300"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Uredi
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDelete}
                className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Izbriši
              </Button>
            )}
            
            {onEditDifficulties && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEditDifficulties}
                className="w-full border-app-purple text-app-purple hover:bg-app-purple/10 hover:text-app-purple transition-all duration-300"
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Uredi govorne težave
              </Button>
            )}
          </div>
        )}
        
        {/* Speech difficulties section */}
        <div className="pt-3 border-t border-gray-100">
          <h5 className="font-medium text-gray-700 mb-2">Govorne težave</h5>
          
          {child.speechDifficulties && child.speechDifficulties.length > 0 ? (
            <SpeechDifficultiesList 
              difficultiesIds={child.speechDifficulties} 
              className="pl-2"
              showDescription={true}
            />
          ) : (
            <p className="text-gray-500 text-sm italic pl-2">
              Ni zabeleženih govornih motenj
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
