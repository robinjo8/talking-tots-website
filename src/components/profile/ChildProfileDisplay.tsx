import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, Pencil, Trash2, FileEdit, Calendar, MessageSquare } from "lucide-react";
import { SpeechDifficultiesList } from "@/components/SpeechDifficultiesList";
import { Badge } from "@/components/ui/badge";
import { SPEECH_DEVELOPMENT_QUESTIONS } from "@/models/SpeechDevelopment";
import { ChildProfile } from "@/contexts/AuthContext";

type ChildProfileDisplayProps = {
  child: ChildProfile;
  onEdit?: () => void;
  onDelete?: () => void;
  onEditDifficulties?: () => void;
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

export function ChildProfileDisplay({ 
  child, 
  onEdit, 
  onDelete,
  onEditDifficulties,
}: ChildProfileDisplayProps) {
  const avatarSrc = getAvatarSrc(child.avatarId);
  
  const formatGender = (gender: string) => {
    switch (gender) {
      case "M": return "Deček";
      case "F": return "Deklica";
      case "Ž": return "Deklica";
      default: return "Ni določeno";
    }
  };

  const calculateAge = (birthDate: Date | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Ni določeno";
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Top section: Child info and action buttons */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side: Avatar and basic info */}
            <div className="flex items-center gap-4">
              {child.avatarId === 0 ? (
                <div className="h-20 w-20 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                  <UserRound className="h-10 w-10 text-gray-400" />
                </div>
              ) : (
                <Avatar className="h-20 w-20 border-2 border-dragon-green/20">
                  <AvatarImage 
                    src={avatarSrc} 
                    alt={`Avatar za ${child.name}`} 
                    className="object-contain" 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-app-blue/20 to-app-purple/20 text-lg font-bold">
                    {child.name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="space-y-2">
                <h4 className="text-2xl font-semibold text-dragon-green">{child.name}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      child.gender === "M" ? "bg-app-blue" : 
                      (child.gender === "F" || child.gender === "Ž") ? "bg-app-orange" : 
                      "bg-gray-400"
                    }`}></span>
                    {formatGender(child.gender)}
                  </p>
                  {child.birthDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {calculateAge(child.birthDate)} let ({formatDate(child.birthDate)})
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side: Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEdit}
                  className="border-app-blue text-app-blue hover:bg-app-blue/10"
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
                  className="border-destructive text-destructive hover:bg-destructive/10"
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
                  className="border-app-purple text-app-purple hover:bg-app-purple/10"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Uredi govorne težave
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom section: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Speech Issues */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h5 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-app-purple" />
              Govorne težave
            </h5>
            
            {child.speechDifficulties && child.speechDifficulties.length > 0 ? (
              <SpeechDifficultiesList 
                difficultiesIds={child.speechDifficulties} 
                showDescription={true}
              />
            ) : (
              <p className="text-gray-500 text-sm italic">
                Ni zabeleženih govornih motenj
              </p>
            )}
            
            {child.speechDifficultiesDescription && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Dodaten opis:</p>
                <p className="text-sm text-gray-600">{child.speechDifficultiesDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: Basic Questionnaire */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h5 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-app-blue" />
              Osnovni vprašalnik
              {child.isComplete && (
                <Badge variant="default" className="text-xs bg-dragon-green text-white ml-2">
                  Izpolnjeno
                </Badge>
              )}
            </h5>
            
            {child.speechDevelopment && Object.keys(child.speechDevelopment).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(child.speechDevelopment).map(([questionId, answer]) => {
                  const question = SPEECH_DEVELOPMENT_QUESTIONS.find(q => q.id === questionId);
                  const option = question?.options.find(opt => opt.value === answer);
                  
                  if (!question || !option) return null;
                  
                  return (
                    <div key={questionId} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">{question.question}</p>
                      <p className="text-sm text-gray-600 pl-3">→ {option.label}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Osnovni vprašalnik ni bil izpolnjen
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}