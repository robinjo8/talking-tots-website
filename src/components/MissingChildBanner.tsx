import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const MissingChildBanner = () => {
  const { user, profile, isLoading } = useAuth();

  // Don't show if loading or not logged in
  if (isLoading || !user) {
    return null;
  }

  // Don't show if user has children
  const hasChildren = profile?.children && profile.children.length > 0;
  if (hasChildren) {
    return null;
  }

  return (
    <div className="fixed top-[57px] md:top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-4 shadow-lg">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
        <span className="text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap">
          Za uporabo aplikacije je potrebno dodati profil otroka.
        </span>
        <Link 
          to="/profile?expandSection=children"
          className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
        >
          Dodaj
        </Link>
      </div>
    </div>
  );
};
