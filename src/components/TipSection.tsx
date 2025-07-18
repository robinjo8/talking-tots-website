
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
type TipSectionProps = {
  childName: string;
};
export function TipSection({
  childName
}: TipSectionProps) {
  return <Card className="mb-8 rounded-2xl border-2 border-dragon-green/30 bg-gradient-to-r from-dragon-green/5 to-app-blue/5 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="rounded-t-2xl pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
            <MessageSquare className="h-5 w-5 text-dragon-green" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4 text-center">
        <h3 className="text-lg font-semibold mb-2 text-dragon-green uppercase">NASVET ZMAJČKA TOMIJA:</h3>
        <div className="flex items-center justify-center gap-6">
          <div className="hidden md:block w-24 h-24">
            <img alt="Tomi the Dragon" className="w-full h-full object-contain" src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" />
          </div>
          <div className="text-left">
            <p className="text-lg mb-2 uppercase font-semibold">"VSE VSEBINE SO PRILAGOJENE STAROSTI IN TEŽAVAM OTROKA. ZA NAJBOLJŠE REZULTATE VADITE REDNO!"</p>
          </div>
        </div>
      </CardContent>
    </Card>;
}
