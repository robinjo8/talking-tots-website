import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SequentialExerciseGrid } from "@/components/exercises/SequentialExerciseGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Instruction speech-bubble */}
        <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
              <MessageSquare className="h-5 w-5 text-dragon-green" />
              Vaje motorike govoril
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <img 
                src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                alt="Zmajček Tomi" 
                className="w-full h-full object-contain animate-bounce-gentle"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-medium italic leading-relaxed">
                Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti. Vaje so pomembne za izboljšanje motorike ust, ki z ostalimi deli govornega aparata oblikuje posamezne glasove ter seveda sam govor. Vaje motorike govoril niso pogoj za pojav govora in ne uporabljamo jih pri terapiji vseh govorno-jezikovnih motenj.
              </p>
            </div>
          </CardContent>
        </Card>

        <SequentialExerciseGrid />
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;