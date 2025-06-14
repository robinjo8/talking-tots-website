
import { Home, Activity, Gamepad, Video, BookOpen, Bell, CreditCard, User, Target, Euro } from "lucide-react";
import { NavigationLink } from "./types";

export const authenticatedNavigationLinks: NavigationLink[] = [
  {
    label: "Namen",
    path: "#purpose",
    icon: Target
  },
  {
    label: "Cenik",
    path: "#pricing",
    icon: Euro
  },
  {
    label: "Vaje",
    path: "/govorno-jezikovne-vaje",
    icon: Activity
  },
  {
    label: "Igre",
    path: "/govorne-igre",
    icon: Gamepad
  },
  {
    label: "Video navodila",
    path: "/video-navodila",
    icon: Video
  },
  {
    label: "Logopedski kotiček",
    path: "/logopedski-koticek",
    icon: BookOpen
  },
  {
    label: "Moja stran",
    path: "/moja-stran",
    icon: Home
  },
  {
    label: "Obvestila",
    path: "#",
    icon: Bell,
    disabled: true
  },
  {
    label: "Moja naročnina",
    path: "/profile",
    icon: CreditCard,
    options: { expandSection: "subscription" }
  },
  {
    label: "Nastavitve",
    path: "/profile",
    icon: User
  }
];

export const unauthenticatedNavigationLinks: NavigationLink[] = [
  {
    label: "Namen",
    path: "#purpose",
    icon: Target
  },
  {
    label: "Cenik",
    path: "#pricing",
    icon: Euro
  },
  {
    label: "Logopedski kotiček",
    path: "/logopedski-koticek",
    icon: BookOpen
  }
];
