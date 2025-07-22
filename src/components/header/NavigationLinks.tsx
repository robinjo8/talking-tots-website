
import { Activity, Award, Video, BookOpen, Home, Bell, CreditCard, User, Gamepad } from "lucide-react";

export interface NavigationLink {
  label: string;
  path: string;
  icon: any;
  disabled?: boolean;
  options?: {
    expandSection?: string;
  };
}

export const navigationLinks: NavigationLink[] = [{
  label: "Logopedski nasveti",
  path: "/logopedski-koticek",
  icon: BookOpen
}, {
  label: "Moje aplikacije",
  path: "/moje-aplikacije",
  icon: Activity
}, {
  label: "Moja stran",
  path: "/moja-stran",
  icon: Home
}, {
  label: "Obvestila",
  path: "#",
  icon: Bell,
  disabled: true
}, {
  label: "Moja naročnina",
  path: "/profile",
  icon: CreditCard,
  options: { expandSection: "subscription" }
}, {
  label: "Nastavitve",
  path: "/profile",
  icon: User
}];
