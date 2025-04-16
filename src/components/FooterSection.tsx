
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type FooterSectionProps = {
  handleSignOut: () => void;
};

export function FooterSection({ handleSignOut }: FooterSectionProps) {
  return (
    <>
      <div className="mt-12 flex flex-col items-center">
        <Button 
          variant="outline" 
          className="border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Odjava
        </Button>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p className="mb-1">Opomba:</p>
        <p>Vse vsebine so prilagojene starosti in težavam otroka.</p>
        <p>Za najboljše rezultate vadite redno!</p>
      </div>
    </>
  );
}
