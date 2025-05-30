
import { MessageSquare } from "lucide-react";

type TipSectionProps = {
  childName: string;
};

export function TipSection({ childName }: TipSectionProps) {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-dragon-green/10 to-app-blue/10 border border-dragon-green/20 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-5 w-5 text-dragon-green" />
        <h3 className="text-lg font-semibold text-dragon-green">
          Nasvet zmajčka Tomija:
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block w-20 h-20 flex-shrink-0">
          <img 
            alt="Tomi the Dragon" 
            className="w-full h-full object-contain" 
            src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" 
          />
        </div>
        <div>
          <p className="text-base font-medium text-gray-700 mb-1">
            "{childName}, danes poskusi ponoviti črko R vsaj 3-krat! Zmoreš!"
          </p>
          <p className="text-sm text-muted-foreground">
            Vsaka vaja ti prinese točke in zvezdice.
          </p>
        </div>
      </div>
    </div>
  );
}
