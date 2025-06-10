
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Gamepad2, 
  Target, 
  Play, 
  ChevronRight,
  Mic,
  Brain,
  Users
} from "lucide-react";

export const ActivityOptions = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Govorno-jezikovne vaje",
      description: "Vaje za izboljšanje govora in jezika",
      icon: BookOpen,
      color: "bg-app-blue",
      path: "/govorno-jezikovne-vaje"
    },
    {
      title: "Artikulacija",
      description: "Vaje za pravilno izgovorjavo glasov",
      icon: Mic,
      color: "bg-app-purple",
      path: "/artikulacija"
    },
    {
      title: "Artikulacijski test",
      description: "Začni test →",
      icon: Target,
      color: "bg-app-orange",
      path: "/artikulacijski-test",
      isTest: true
    },
    {
      title: "Govorne igre",
      description: "Zabavne igre za razvoj govora",
      icon: Gamepad2,
      color: "bg-app-teal",
      path: "/govorne-igre"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {activities.map((activity, index) => {
        const IconComponent = activity.icon;
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
            onClick={() => navigate(activity.path)}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`${activity.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-dragon-green transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {activity.description}
                  </p>
                  
                  {activity.isTest ? (
                    <Button 
                      size="sm" 
                      className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Začni test
                    </Button>
                  ) : (
                    <div className="flex items-center text-dragon-green text-sm font-medium group-hover:gap-2 transition-all">
                      Odpri
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
