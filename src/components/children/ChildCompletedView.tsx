
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserX } from "lucide-react";
import { SpeechDifficultiesList } from "@/components/SpeechDifficultiesList";
import { format } from "date-fns";
import { avatarOptions } from "@/components/AvatarSelector";

interface SavedChild {
  name: string;
  gender: string;
  avatarId: number;
  birthDate: Date | null;
  speechDifficulties: string[];
  speechDevelopment: Record<string, string>;
}

type ChildCompletedViewProps = {
  child: SavedChild;
  onAddNewChild: () => void;
  onClose?: () => void;
};

export function ChildCompletedView({ child, onAddNewChild, onClose }: ChildCompletedViewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-2">Otrok uspešno dodan</h3>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
        <div className="flex items-center gap-3 mb-3">
          {child.avatarId === 0 ? (
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gray-100">
              <UserX className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={avatarOptions.find(a => a.id === child.avatarId)?.src} 
                alt="Avatar otroka" 
              />
              <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h4 className="font-medium">{child.name}</h4>
            <p className="text-sm text-gray-600">
              Spol: {child.gender === "M" ? "Deček" : child.gender === "Ž" ? "Deklica" : "Ni izbrano"}
            </p>
            {child.birthDate && (
              <p className="text-sm text-gray-600">
                Datum rojstva: {format(child.birthDate, "dd.MM.yyyy")}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-2">Izbrane govorne težave:</h5>
          <SpeechDifficultiesList difficultiesIds={child.speechDifficulties} />
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <Button
          type="button"
          onClick={onAddNewChild}
          className="w-full bg-dragon-green hover:bg-dragon-green/90"
        >
          Dodaj otroka
        </Button>
        
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Zaključi
          </Button>
        )}
      </div>
    </div>
  );
}
