import { User, Users, CircleDollarSign, CreditCard, Shield, FileText, ClipboardCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";

type ProfileSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  childrenCount: number;
};

const menuItems = [
  { id: "userProfile", label: "Moj profil", icon: User },
  { id: "myDocuments", label: "Moji dokumenti", icon: FileText },
  { id: "children", label: "Otroci", icon: Users, showCount: true },
  { id: "articulationTest", label: "Test izgovorjave", icon: ClipboardCheck, proOnly: true },
  { id: "subscription", label: "Naročnina", icon: CircleDollarSign },
  { id: "paymentMethods", label: "Plačilne metode", icon: CreditCard },
  { id: "passwordChange", label: "Spremeni geslo", icon: Shield },
];

export function ProfileSidebar({ activeSection, setActiveSection, childrenCount }: ProfileSidebarProps) {
  const { isPro } = useSubscriptionContext();
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
          const isLocked = item.proOnly && !isPro;
          
          return (
            <button
              key={item.id}
              onClick={() => !isLocked && setActiveSection(item.id)}
              disabled={isLocked}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                isLocked
                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                  : isActive 
                    ? "bg-dragon-green text-white" 
                    : "text-gray-700 hover:bg-dragon-green/10"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isLocked && "text-gray-300")} />
              <div className="flex flex-col">
                <span className="font-medium">
                  {item.label}
                  {item.showCount && ` (${childrenCount})`}
                </span>
                {isLocked && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Na voljo v TomiTalk Pro
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
