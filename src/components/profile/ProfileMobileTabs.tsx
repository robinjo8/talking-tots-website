import { User, Users, CircleDollarSign, CreditCard, Shield, FileText, ClipboardCheck, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { cn } from "@/lib/utils";

type ProfileMobileTabsProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  childrenCount: number;
};

const tabs = [
  { id: "userProfile", label: "Moj profil", icon: User },
  { id: "myDocuments", label: "Moji dokumenti", icon: FileText },
  { id: "children", label: "Otroci", icon: Users, showCount: true },
  { id: "articulationTest", label: "Preverjanje izgovorjave", icon: ClipboardCheck, proOnly: true },
  { id: "subscription", label: "Naročnina", icon: CircleDollarSign },
  { id: "paymentMethods", label: "Plačilne metode", icon: CreditCard },
  { id: "passwordChange", label: "Spremeni geslo", icon: Shield },
];

export function ProfileMobileTabs({ activeSection, setActiveSection, childrenCount }: ProfileMobileTabsProps) {
  const { isPro } = useSubscriptionContext();
  const { unreadCount } = useUserNotifications();
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
          const isLocked = tab.proOnly && !isPro;
          return (
            <SelectItem 
              key={tab.id} 
              value={tab.id} 
              disabled={isLocked}
              className={cn(
                "cursor-pointer",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", isLocked ? "text-gray-400" : "text-dragon-green")} />
                <div className="flex flex-col flex-1">
                  <span className={cn("flex items-center gap-2", isLocked ? "text-gray-400" : "")}>
                    {tab.label}
                    {tab.showCount && ` (${childrenCount})`}
                    {tab.id === 'myDocuments' && unreadCount > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-app-orange text-[9px] font-medium text-white flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </span>
                  {isLocked && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Na voljo v TomiTalk Pro
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
