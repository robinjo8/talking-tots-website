
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type FooterSectionProps = {
  handleSignOut: () => void;
};

export function FooterSection({ handleSignOut }: FooterSectionProps) {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      <p className="mb-1">Opomba:</p>
      <p>Vse vsebine so prilagojene starosti in težavam otroka.</p>
      <p>Za najboljše rezultate vadite redno!</p>
    </div>
  );
}
