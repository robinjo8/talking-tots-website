
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
  label: "Poslušanje",
  path: "/poslusanje",
  icon: Bell
}, {
  label: "Govor",
  path: "/moje-aplikacije",
  icon: Activity
}, {
  label: "Jezik",
  path: "/jezik",
  icon: BookOpen
}, {
  label: "Moja stran",
  path: "/moja-stran",
  icon: Home
}];
