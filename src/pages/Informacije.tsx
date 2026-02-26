import Header from "@/components/Header";

import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Mail, Gamepad2, User, Building2, CreditCard, HelpCircle } from "lucide-react";

const infoCards = [
  { icon: BookOpen, title: "Kako deluje\nTomiTalk", path: "/kako-deluje", color: "text-dragon-green" },
  { icon: Users, title: "Kdo smo", path: "/kdo-smo", color: "text-app-blue" },
  { icon: Mail, title: "Kontakt", path: "/kontakt", color: "text-teal-500" },
  { icon: Gamepad2, title: "Preverjanje\nizgovorjave", path: "/delovanje-testa", color: "text-app-orange" },
  { icon: User, title: "Za starše", path: "/za-posameznike", color: "text-purple-500" },
  { icon: Building2, title: "Za organizacije", path: "/za-podjetja", color: "text-app-blue" },
  { icon: CreditCard, title: "Cenik", path: "/cenik", color: "text-dragon-green" },
  { icon: HelpCircle, title: "Pomoč in\npodpora", path: "/pomoc-in-podpora", color: "text-yellow-500" },
];

const Informacije = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase mb-2">
            Informacije
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Vse informacije o TomiTalk na enem mestu
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {infoCards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-2xl bg-card hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <card.icon className={`w-14 h-14 md:w-16 md:h-16 ${card.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              <span className="text-sm md:text-base font-bold uppercase text-foreground text-center whitespace-pre-line leading-tight">
                {card.title}
              </span>
            </button>
          ))}
        </div>
      </main>
      
    </div>
  );
};

export default Informacije;
