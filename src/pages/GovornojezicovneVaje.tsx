
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, TestTube, Volume2 } from "lucide-react";

const GovornojezicovneVaje = () => {
  const navigate = useNavigate();

  const exerciseTypes = [
    {
      id: "vaje-za-jezik",
      title: "Vaje za jezik",
      description: "Gibalne vaje za jezik, ki pomagajo pri artikulaciji",
      icon: Dumbbell,
      color: "text-app-purple",
      gradient: "from-app-purple/10 to-app-blue/10",
      path: "/govorno-jezikovne-vaje/vaje-za-jezik"
    },
    {
      id: "artikulacijski-test", 
      title: "Artikulacijski test",
      description: "Preveri izgovorjavo posameznih glasov",
      icon: TestTube,
      color: "text-app-orange",
      gradient: "from-app-orange/10 to-app-yellow/10",
      path: "/artikulacijski-test"
    },
    {
      id: "artikulacija",
      title: "Artikulacija",
      description: "Vaje za pravilno izgovorjavo glasov",
      icon: Volume2,
      color: "text-dragon-green",
      gradient: "from-dragon-green/10 to-app-teal/10",
      path: "/artikulacija"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Govorno-jezikovne vaje" backPath="/moja-stran" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed govornih vaj in začni z vadbo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseTypes.map((exercise) => (
            <Card 
              key={exercise.id}
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => navigate(exercise.path)}
            >
              <CardHeader className={`bg-gradient-to-r ${exercise.gradient} rounded-t-2xl pb-4`}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <exercise.icon className={`h-6 w-6 ${exercise.color}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className={`text-lg font-semibold mb-2 ${exercise.color}`}>{exercise.title}</h3>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovornojezicovneVaje;
