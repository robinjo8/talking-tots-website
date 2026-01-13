import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SPEECH_DEVELOPMENT_QUESTIONS, SPEECH_DEVELOPMENT_TEXT_QUESTIONS } from "@/models/SpeechDevelopment";
import { ChildProfile } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type ChildProfileDisplayProps = {
  child: ChildProfile;
  isPro?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onEditDifficulties?: () => void;
  onEditDevelopment?: () => void;
};

const getAvatarSrc = (avatarId: number): string => {
  const avatarImages = [
    "", // id 0 - no avatar
    "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", // id 1
    "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e5f15.png", // id 2
    "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", // id 3
    "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", // id 4
    "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", // id 5
    "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", // id 6
    "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", // id 7
    "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", // id 8
    "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", // id 9
    "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", // id 10
    "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", // id 11
    "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", // id 12
    "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", // id 13
    "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", // id 14
    "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"  // id 15
  ];

  return avatarImages[avatarId] || "";
};

export function ChildProfileDisplay({ 
  child, 
  isPro = false,
  onEdit, 
  onDelete,
  onRefresh,
  onEditDifficulties,
  onEditDevelopment,
}: ChildProfileDisplayProps) {
  const [difficultiesOpen, setDifficultiesOpen] = useState(false);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  
  const avatarSrc = child.avatarUrl || getAvatarSrc(child.avatarId);
  
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

  return (
    <div className="w-full space-y-4">
      {/* Top section: Child info with larger avatar */}
      <Card className="w-full border-dragon-green/20">
        <CardContent className="pt-4 pb-6 px-6">
          {/* Action buttons - top right */}
          <div className="flex justify-end gap-1 -mt-1 -mr-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEdit}
                className="h-8 w-8 text-muted-foreground hover:text-dragon-green hover:bg-dragon-green/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Centered avatar and info */}
          <div className="flex flex-col items-center text-center -mt-2">
            {child.avatarId === 0 ? (
              <div className="h-32 w-32 rounded-full flex items-center justify-center bg-muted border-2 border-muted-foreground/20">
                <UserRound className="h-16 w-16 text-muted-foreground" />
              </div>
            ) : (
              <Avatar className="h-32 w-32 border-3 border-dragon-green/30">
                <AvatarImage 
                  src={avatarSrc} 
                  alt={`Avatar za ${child.name}`} 
                  className="object-contain" 
                />
                <AvatarFallback className="bg-dragon-green/10 text-2xl font-bold text-dragon-green">
                  {child.name[0]}
                </AvatarFallback>
              </Avatar>
            )}
            
            <h4 className="text-xl font-semibold text-dragon-green mt-3">{child.name}</h4>
            
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  child.gender === "M" ? "bg-blue-500" : 
                  (child.gender === "F" || child.gender === "Ž") ? "bg-pink-500" : 
                  "bg-muted-foreground"
                )} />
                {formatGender(child.gender)}
              </span>
              {child.birthDate && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{calculateAge(child.birthDate)} let</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Govorne težave - Collapsible - Only for Pro users */}
      {isPro && (
        <Collapsible open={difficultiesOpen} onOpenChange={setDifficultiesOpen}>
          <Card className="border-dragon-green/20">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors relative">
                <h5 className="font-medium text-foreground">Govorne težave</h5>
                <div className="absolute right-4 flex items-center gap-2">
                  {onEditDifficulties && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDifficulties();
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-dragon-green hover:bg-dragon-green/10"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    difficultiesOpen && "rotate-180"
                  )} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0">
                {child.speechDifficulties && child.speechDifficulties.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {child.speechDifficulties.map((difficultyId, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-dragon-green/10 text-dragon-green border-dragon-green/20"
                        >
                          {difficultyId}
                        </Badge>
                      ))}
                    </div>
                    
                    {child.speechDifficultiesDescription && (
                      <p className="text-sm text-muted-foreground">
                        {child.speechDifficultiesDescription}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Ni zabeleženih govornih motenj
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Osnovni vprašalnik - Collapsible - Only for Pro users */}
      {isPro && (
        <Collapsible open={questionnaireOpen} onOpenChange={setQuestionnaireOpen}>
          <Card className="border-dragon-green/20">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors relative">
                <h5 className="font-medium text-foreground">Osnovni vprašalnik</h5>
                <div className="absolute right-4 flex items-center gap-2">
                  {onEditDevelopment && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDevelopment();
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-dragon-green hover:bg-dragon-green/10"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    questionnaireOpen && "rotate-180"
                  )} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0">
                {child.speechDevelopment && Object.keys(child.speechDevelopment).length > 0 ? (
                  <div className="space-y-3">
                    {/* Radio questions */}
                    {Object.entries(child.speechDevelopment).map(([questionId, answer]) => {
                      const question = SPEECH_DEVELOPMENT_QUESTIONS.find(q => q.id === questionId);
                      if (!question) return null;
                      
                      const option = question.options.find(opt => opt.value === answer);
                      if (!option) return null;
                      
                      return (
                        <div key={questionId}>
                          <p className="text-sm text-muted-foreground">{question.question}</p>
                          <p className="text-sm text-dragon-green font-medium mt-0.5">→ {option.label}</p>
                        </div>
                      );
                    })}
                    
                    {/* Text questions */}
                    {SPEECH_DEVELOPMENT_TEXT_QUESTIONS.map((textQuestion) => {
                      const answer = child.speechDevelopment?.[textQuestion.id];
                      if (!answer) return null;
                      
                      return (
                        <div key={textQuestion.id}>
                          <p className="text-sm text-muted-foreground">{textQuestion.question}</p>
                          <p className="text-sm text-dragon-green font-medium mt-0.5">→ {answer}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Osnovni vprašalnik ni bil izpolnjen
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
