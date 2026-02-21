
import { Ear, Speech, BookOpen, Home, CreditCard, Settings } from "lucide-react";
import { LipsIcon } from "@/components/icons/LipsIcon";

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
  icon: Ear
}, {
  label: "Govor",
  path: "/moje-aplikacije",
  icon: Speech
}, {
  label: "Jezik",
  path: "/jezik",
  icon: LipsIcon
}, {
  label: "Moja stran",
  path: "/moja-stran",
  icon: Home
}];
