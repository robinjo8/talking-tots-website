import { User, Users, CircleDollarSign, CreditCard, Shield, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  childrenCount: number;
};

const menuItems = [
  { id: "userProfile", label: "Moj profil", icon: User },
  { id: "myDocuments", label: "Moji dokumenti", icon: FileText },
  { id: "children", label: "Otroci", icon: Users, showCount: true },
  { id: "subscription", label: "Naročnina", icon: CircleDollarSign },
  { id: "paymentMethods", label: "Plačilne metode", icon: CreditCard },
  { id: "passwordChange", label: "Spremeni geslo", icon: Shield },
];

export function ProfileSidebar({ activeSection, setActiveSection, childrenCount }: ProfileSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden sticky top-28">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-lg font-semibold">Nastavitve</h2>
      </div>
      
      {/* Menu items */}
      <nav className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-dragon-green text-white" 
                  : "text-gray-700 hover:bg-dragon-green/10"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">
                {item.label}
                {item.showCount && ` (${childrenCount})`}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
