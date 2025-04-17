
import { AppSidebar } from "./AppSidebar";

interface MobileMenuProps {
  onItemClick: () => void;
}

export function MobileMenu({ onItemClick }: MobileMenuProps) {
  return (
    <div className="px-4 py-6 h-[80vh] flex flex-col">
      <AppSidebar />
    </div>
  );
}
