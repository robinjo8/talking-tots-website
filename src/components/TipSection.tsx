
import { MessageSquare } from "lucide-react";

type TipSectionProps = {
  childName: string;
};

export function TipSection({ childName }: TipSectionProps) {
  return (
    <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-dragon-green/20 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-dragon-green/10 rounded-full flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-dragon-green" />
        </div>
        <h3 className="text-base font-semibold text-dragon-green">
          Nasvet zmajčka Tomija:
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block w-12 h-12 flex-shrink-0">
          <img 
            alt="Tomi the Dragon" 
            className="w-full h-full object-contain" 
            src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" 
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            "{childName}, danes poskusi ponoviti črko R vsaj 3-krat! Zmoreš!"
          </p>
          <p className="text-xs text-muted-foreground">
            Vsaka vaja ti prinese točke in zvezdice.
          </p>
        </div>
      </div>
    </div>
  );
}
