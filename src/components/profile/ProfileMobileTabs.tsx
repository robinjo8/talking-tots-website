import { User, Users, CircleDollarSign, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileMobileTabsProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  childrenCount: number;
};

const tabs = [
  { id: "userProfile", label: "Profil", icon: User },
  { id: "children", label: "Otroci", icon: Users, showCount: true },
  { id: "subscription", label: "Naročnina", icon: CircleDollarSign },
  { id: "paymentMethods", label: "Plačila", icon: CreditCard },
  { id: "passwordChange", label: "Geslo", icon: Shield },
];

export function ProfileMobileTabs({ activeSection, setActiveSection, childrenCount }: ProfileMobileTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-dragon-green text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-dragon-green/10"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>
                {tab.label}
                {tab.showCount && ` (${childrenCount})`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
