
import { MessageSquare } from "lucide-react";

type TipSectionProps = {
  childName: string;
};

export function TipSection({ childName }: TipSectionProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50/80 border border-gray-200/60 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 bg-dragon-green/15 rounded-lg flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-dragon-green" />
        </div>
        <h3 className="text-sm font-medium text-dragon-green">
          Nasvet zmajčka Tomija:
        </h3>
      </div>
      <div className="flex items-start gap-3">
        <div className="hidden md:block w-10 h-10 flex-shrink-0">
          <img 
            alt="Tomi the Dragon" 
            className="w-full h-full object-contain" 
            src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" 
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 leading-relaxed">
            "{childName}, danes poskusi ponoviti črko R vsaj 3-krat! Zmoreš!"
          </p>
          <p className="text-xs text-gray-500">
            Vsaka vaja ti prinese točke in zvezdice.
          </p>
        </div>
      </div>
    </div>
  );
}
