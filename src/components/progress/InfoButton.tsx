import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface InfoButtonProps {
  content: string;
}

export function InfoButton({ content }: InfoButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-0 right-0 w-6 h-6 p-0 rounded-full bg-muted hover:bg-muted/80 border border-border"
        >
          <Info className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="top" align="end">
        <div className="space-y-2">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}