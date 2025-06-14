
import { LucideIcon } from "lucide-react";

export interface NavigationLink {
  label: string;
  path: string;
  icon?: LucideIcon;
  disabled?: boolean;
  options?: {
    expandSection?: string;
  };
}
