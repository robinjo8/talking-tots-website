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
    <div className="fixed top-[57px] md:top-[72px] left-0 right-0 z-40 bg-red-500 text-white py-2 px-4 shadow-lg">
      <div className="container max-w-6xl mx-auto flex items-center justify-center gap-3">
        <span className="text-sm font-medium whitespace-nowrap">
          Za začetek uporabe dodajte profil otroka.
        </span>
        <Link 
          to="/profile?expandSection=children"
          className="bg-white text-red-500 px-4 py-1 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          Dodaj
        </Link>
      </div>
    </div>
  );
};
