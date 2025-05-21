
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SpeechHeaderProps {
  onBack: () => void;
  childName: string;
  title: string;
}

export function SpeechHeader({ onBack, childName, title }: SpeechHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>
      <h3 className="text-lg font-medium">{title} {childName}</h3>
    </div>
  );
}
