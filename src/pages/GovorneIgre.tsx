import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export default function GovorneIgre() {
  const {
    profile,
    selectedChildIndex
  } = useAuth();
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childName = selectedChild?.name;
  return <div className="min-h-screen bg-background">
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
          <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <img src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" alt="Zmajček Tomi" className="w-full h-full object-contain animate-bounce-gentle" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-medium italic leading-relaxed">IZBERI ENO IZMED SPODNJIH IGER IN ZAČNI VADITI IZGOVORJAVO. VSAKA IGRA JE ZABAVEN KORAK DO HITREJŠEGA NAPREDKA!</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
            </div>
          </CardContent>
        </Card>

        <GamesList />
      </div>
    </div>;
}