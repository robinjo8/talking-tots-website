import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function SestavljankeGames() {
  const navigate = useNavigate();

  const handleRClick = () => {
    navigate("/govorne-igre/sestavljanke/r");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Section 1: Izberi sestavljanko */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 mt-12">Izberi sestavljanko:</h2>
          <div className="flex justify-start">
            <Card 
              className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer hover:scale-105 w-24 h-24"
              onClick={handleRClick}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">R</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Section 2: Kmalu na voljo */}
        <div>
          <h2 className="text-2xl font-bold mb-6 mt-12">Kmalu na voljo:</h2>
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 [-webkit-overflow-scrolling:touch] scrollbar-hide">
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-orange">B</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-teal/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-dragon-green">C</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-blue">Č</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">D</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-orange">F</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-teal/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-dragon-green">G</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-blue">H</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">J</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-orange">K</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-teal/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-dragon-green">L</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-blue">M</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">N</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-orange">P</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-teal/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-dragon-green">S</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-blue">Š</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-purple">T</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-orange">V</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-teal/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-dragon-green">Z</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="transition-all duration-300 rounded-3xl border-2 border-gray-200 opacity-60 cursor-not-allowed w-24 h-24 flex-shrink-0">
              <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 rounded-3xl p-0 h-full flex items-center justify-center">
                <CardTitle className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-app-blue">Ž</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}