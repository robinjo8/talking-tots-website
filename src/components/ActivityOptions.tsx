
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad, MessageSquare, Trophy, BookOpen } from "lucide-react";

const activities = [
  {
    id: "govorne-igre",
    title: "Govorne igre",
    subtitle: "Zabavne igre za razvoj govora",
    description: "Interaktivne igre za izboljšanje izgovorjave",
    icon: Gamepad,
    gradient: "from-orange-400 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
    path: "/govorne-igre"
  },
  {
    id: "vaje",
    title: "Vaje",
    subtitle: "Govorno-jezikovne vaje",
    description: "Strukturirane vaje za govorno terapijo",
    icon: MessageSquare,
    gradient: "from-purple-400 to-purple-600", 
    bgGradient: "from-purple-50 to-purple-100",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    path: "/govorno-jezikovne-vaje"
  },
  {
    id: "izzivi",
    title: "Izzivi",
    subtitle: "Moji izzivi",
    description: "Dosegaj cilje in zbiri nagrade",
    icon: Trophy,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100", 
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    path: "/moji-izzivi"
  },
  {
    id: "koticek",
    title: "Kotiček",
    subtitle: "Logopedski kotiček",
    description: "Nasveti in vodila za starše",
    icon: BookOpen,
    gradient: "from-green-400 to-green-600",
    bgGradient: "from-green-50 to-green-100",
    buttonColor: "bg-green-500 hover:bg-green-600", 
    path: "/logopedski-koticek"
  }
];

export function ActivityOptions() {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Kaj želiš danes početi?</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <Card 
              key={activity.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 overflow-hidden bg-white"
              onClick={() => navigate(activity.path)}
            >
              <CardContent className="p-0">
                {/* Icon Header with Gradient */}
                <div className={`bg-gradient-to-br ${activity.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                  <div className="relative z-10 flex justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className={`bg-gradient-to-br ${activity.bgGradient} p-6`}>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
                    {activity.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex justify-center">
                    <Button 
                      size="sm"
                      className={`${activity.buttonColor} text-white rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105`}
                    >
                      Začni
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
