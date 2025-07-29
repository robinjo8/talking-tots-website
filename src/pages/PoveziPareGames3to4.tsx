
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";

export default function PoveziPareGames3to4() {
  const navigate = useNavigate();
  const {
    profile,
    selectedChildIndex
  } = useAuth();
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childName = selectedChild?.name;

  const handleRClick = () => {
    navigate("/govorne-igre/povezi-pare/r");
  };

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
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
                <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU POVEZATI PARE. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
                <p className="text-sm text-muted-foreground mt-2">IGRE ZA STAROST 3-4 LETA - Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Izberi igro */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">
              IZBERI IGRO (3-4 LETA)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Card 
                className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col cursor-pointer hover:scale-105"
                onClick={handleRClick}
              >
                <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-t-2xl pb-4">
                  <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                      <span className="text-2xl font-bold text-app-purple">
                        R
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4 flex-grow text-center">
                  <p className="text-sm font-semibold mb-2 text-app-purple">
                    Poveži pare s črko R in nato glasno ponovi besedo
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2: Kmalu na voljo */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-muted-foreground">
              KMALU NA VOLJO
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Placeholder for future letters - simplified for age 3-4 */}
              <Card className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col opacity-60 cursor-not-allowed">
                <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
                  <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                      <span className="text-2xl font-bold text-app-orange">S</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4 flex-grow text-center">
                  <p className="text-sm font-semibold mb-2 text-app-orange">
                    Poveži pare s črko S
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    KMALU NA VOLJO
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AgeGatedRoute>
  );
}
