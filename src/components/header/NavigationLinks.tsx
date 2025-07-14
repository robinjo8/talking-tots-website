
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
  label: "Vaje",
  path: "/govorno-jezikovne-vaje",
  icon: Activity
}, {
  label: "Igre",
  path: "/govorne-igre",
  icon: Gamepad
}, {
  label: "Izzivi",
  path: "/moji-izzivi",
  icon: Award
}, {
  label: "Video navodila",
  path: "/video-navodila",
  icon: Video
}, {
  label: "Logopedski nasveti",
  path: "/logopedski-koticek",
  icon: BookOpen
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
