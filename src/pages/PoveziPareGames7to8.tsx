
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";

export default function PoveziPareGames7to8() {
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;

  return (
    <AgeGatedRoute requiredAgeGroup="7-8">
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
                <p className="text-lg font-medium italic">SUPER! SI ŽE PRAV PRAVI STROKOVNJAK! PRIPRAVILI SMO TI POSEBNE IZZIVE!</p>
                <p className="text-sm text-muted-foreground mt-2">IGRE ZA STAROST 7-8 LET - ZA PRAVE MAJSTRE BESED!</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-8 text-primary">
              IGRE ZA STAROST 7-8 LET
            </h2>
            <div className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-xl mb-4">🏆 NAPREDNI IZZIVI 🏆</p>
              <p className="text-lg text-muted-foreground">
                Pripravljamo zahtevnejše naloge za mlade strokovnjake!
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Kmalu boš lahko preizkusil svoje znanje z zahtevnejšimi besedami in kombinacijami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AgeGatedRoute>
  );
}
