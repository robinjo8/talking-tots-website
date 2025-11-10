import { Volume2, BookOpen, Activity, MessageSquare } from "lucide-react";
import { WavyDivider } from "./WavyDivider";

const outcomes = [
  {
    icon: Volume2,
    title: "Pravilna izgovorjava glasov in besed",
    description: "Otroci se bodo naučili pravilno izgovarjati posamezne glasove skozi zabavne in ponavljajoče se vaje"
  },
  {
    icon: BookOpen,
    title: "Bogatenje besednega zaklada",
    description: "Spoznavanje novih besed ter jih povezovali z vsakodnevnimi situacijami"
  },
  {
    icon: Activity,
    title: "Razvoj govorne motorike",
    description: "Otroci bodo krepili mišice ustnic, jezika in čeljusti, ki so ključne za jasno in tekoče govorjenje"
  },
  {
    icon: MessageSquare,
    title: "Sposobnost razumevanja in izražanja",
    description: "Otroci bodo izboljšali razumevanje navodil, tvorbo stavkov in samozavest pri govornem izražanju"
  }
];

export const LearningOutcomesSection = () => {
  return (
    <section className="relative py-20 px-4 md:px-10 bg-dragon-green w-full">
      <WavyDivider color="green" position="top" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Kaj se bodo otroci naučili
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-dragon-green/10 rounded-full">
                    <Icon className="h-8 w-8 text-dragon-green" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {outcome.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <WavyDivider color="green" position="bottom" />
    </section>
  );
};
