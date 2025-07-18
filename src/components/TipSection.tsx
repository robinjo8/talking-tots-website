import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
type TipSectionProps = {
  childName: string;
};
export function TipSection({
  childName
}: TipSectionProps) {
  return <Card className="mb-8 rounded-2xl border-2 border-dragon-green/30 bg-gradient-to-r from-dragon-green/5 to-app-blue/5 transition-all duration-300 hover:shadow-lg">
      
      <CardContent className="pt-6 pb-4 text-center">
        <h3 className="font-semibold mb-2 text-dragon-green uppercase text-2xl">NASVET ZMAJČKA TOMIJA:</h3>
        <div className="flex items-center justify-center gap-6">
          <div className="hidden md:block w-24 h-24">
            <img alt="Tomi the Dragon" className="w-full h-full object-contain" src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" />
          </div>
          <div className="text-left">
            <p className="text-lg mb-2 uppercase font-semibold">"VSE VSEBINE SO PRILAGOJENE. ZA NAJBOLJŠE REZULTATE VADITE REDNO!"</p>
          </div>
        </div>
      </CardContent>
    </Card>;
}