import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";

export const useBannerVisible = () => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading || !user) {
    return false;
  }
  
  const hasChildren = profile?.children && profile.children.length > 0;
  return !hasChildren;
};

export const MissingChildBanner = () => {
  const isMobile = useIsMobile();
  const isVisible = useBannerVisible();

  if (!isVisible) {
    return null;
  }

  // Mobile: entire banner is clickable
  if (isMobile) {
    return (
      <Link 
        to="/profile?expandSection=children"
        className="fixed top-14 left-0 right-0 z-40 bg-red-500 text-white py-3 px-4 shadow-lg hover:bg-red-600 transition-colors block"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium text-center">
            Za začetek uporabe dodajte profil otroka.
          </span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </div>
      </Link>
    );
  }

  // Desktop: banner with button
  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-red-500 text-white py-3.5 px-4 shadow-lg">
      <div className="container max-w-6xl mx-auto flex items-center justify-center gap-4">
        <span className="text-base font-medium leading-none">
          Za začetek uporabe dodajte profil otroka.
        </span>
        <Link 
          to="/profile?expandSection=children"
          className="bg-white text-red-500 px-5 py-1.5 rounded-full text-base font-semibold hover:bg-red-50 transition-colors whitespace-nowrap flex items-center justify-center leading-none"
        >
          Dodaj
        </Link>
      </div>
    </div>
  );
};
