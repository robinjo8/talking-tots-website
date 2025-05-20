import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
type TipSectionProps = {
  childName: string;
};
export function TipSection({
  childName
}: TipSectionProps) {
  return <Card className="mb-8 border-dragon-green/30 bg-gradient-to-r from-dragon-green/5 to-app-blue/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-dragon-green" />
          Nasvet zmajčka Tomija:
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex items-center gap-6">
        <div className="hidden md:block w-24 h-24">
          <img alt="Tomi the Dragon" className="w-full h-full object-contain" src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" />
        </div>
        <div>
          <p className="text-lg mb-2">"{childName}, danes poskusi ponoviti črko R vsaj 3-krat! Zmoreš!"</p>
          <p className="text-sm text-muted-foreground">Vsaka vaja ti prinese točke in zvezdice.</p>
        </div>
      </CardContent>
    </Card>;
}