import { User, Users, CircleDollarSign, CreditCard, Shield, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileMobileTabsProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  childrenCount: number;
};

const tabs = [
  { id: "userProfile", label: "Moj profil", icon: User },
  { id: "myDocuments", label: "Moji dokumenti", icon: FileText },
  { id: "children", label: "Otroci", icon: Users, showCount: true },
  { id: "subscription", label: "Naročnina", icon: CircleDollarSign },
  { id: "paymentMethods", label: "Plačilne metode", icon: CreditCard },
  { id: "passwordChange", label: "Spremeni geslo", icon: Shield },
];

export function ProfileMobileTabs({ activeSection, setActiveSection, childrenCount }: ProfileMobileTabsProps) {
  const activeTab = tabs.find(tab => tab.id === activeSection);
  const ActiveIcon = activeTab?.icon || User;
  
  return (
    <Select value={activeSection} onValueChange={setActiveSection}>
      <SelectTrigger className="w-full bg-white border border-dragon-green/30 focus:ring-dragon-green shadow-sm">
        <div className="flex items-center gap-2">
          <ActiveIcon className="h-4 w-4 text-dragon-green" />
          <SelectValue>
            {activeTab?.label}
            {activeTab?.showCount && ` (${childrenCount})`}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg z-[100]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <SelectItem key={tab.id} value={tab.id} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-dragon-green" />
                <span>
                  {tab.label}
                  {tab.showCount && ` (${childrenCount})`}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
