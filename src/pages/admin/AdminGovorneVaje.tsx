import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

const exerciseTypes = [
  {
    id: "vaje-motorike-govoril",
    title: "VAJE MOTORIKE GOVORIL",
    description: "Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti.",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    available: true
  },
  {
    id: "artikulacija",
    title: "VAJE ZA IZGOVORJAVO GLASOV",
    description: "Otroci se spopadajo z napačno izreko posebnih glasov, ki jih v vsakih osvojil samoli ali ob podporo.",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    available: true
  },
  {
    id: "motnja-ritma-tempa",
    title: "MOTNJA RITMA IN TEMPA GOVORA",
    description: "Govorna hitkoživost ali prelepima rezi besedami.",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    available: false
  },
  {
    id: "sibek-besedni-zaklad",
    title: "ŠIBEK BESEDNI ZAKLAD",
    description: "Otrok pozna premalo besed za svojo starost.",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    available: false
  },
];

export default function AdminGovorneVaje() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  const handleExerciseClick = (exerciseId: string) => {
    if (exerciseId === "vaje-motorike-govoril") {
      navigate(`/admin/children/${childId}/exercises/vaje-motorike-govoril`);
    } else if (exerciseId === "artikulacija") {
      navigate(`/admin/children/${childId}/exercises/artikulacija`);
    }
  };

  return (
    <AdminGameWrapper 
      title="Govorne vaje"
      backPath={`/admin/children/${childId}/workspace`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exerciseTypes.map(exercise => (
          <div key={exercise.id} className="flex h-full">
            <div
              className={cn(
                "bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group flex flex-col w-full",
                exercise.available 
                  ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"
              )}
              onClick={() => exercise.available && handleExerciseClick(exercise.id)}
            >
              {/* Card Header with gradient */}
              <div className={`relative bg-gradient-to-br ${exercise.gradient} p-6 flex items-center justify-center min-h-[120px]`}>
                {!exercise.available && (
                  <div className="absolute top-4 right-4 bg-muted text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Kmalu
                  </div>
                )}
                <h3 className={`text-xl font-bold text-center ${exercise.color} px-4`}>
                  {exercise.title}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exercise.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminGameWrapper>
  );
}
