
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";

export default function PoveziPareGames5to6() {
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;

  return (
    <AgeGatedRoute requiredAgeGroup="5-6">
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          {/* Instruction speech-bubble */}
          <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
                <MessageSquare className="h-5 w-5 text-dragon-green" />
                HEJ, {childName?.toUpperCase() || "TIAN"}!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex items-center gap-4">
              <div className="hidden sm:block w-20 h-20">
                <img 
                  src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                  alt="Zmajček Tomi" 
                  className="w-full h-full object-contain animate-bounce-gentle"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium italic">ODLIČEN NAPREDEK! SEDAJ LAHKO POSKUSIŠ Z BOLJ ZAHTEVNIMI IGRAMI!</p>
                <p className="text-sm text-muted-foreground mt-2">IGRE ZA STAROST 5-6 LET - IZZIVI ZA NAPREDNEJŠE OTROKE!</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-8 text-primary">
              IGRE ZA STAROST 5-6 LET
            </h2>
            <div className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-xl mb-4">🚧 V RAZVOJU 🚧</p>
              <p className="text-lg text-muted-foreground">
                Pripravljamo posebne izzive za tvojo starostno skupino!
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Kmalu boš lahko raziskal nove igre, prilagojene tvojemu znanju in sposobnostim.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AgeGatedRoute>
  );
}
