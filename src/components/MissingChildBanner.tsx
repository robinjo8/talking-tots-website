import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useBannerVisible = () => {
  const { user, profile } = useAuth();
  return user && (!profile?.children || profile.children.length === 0);
};

export const MissingChildBanner = () => {
  const isVisible = useBannerVisible();

  if (!isVisible) return null;

  return (
    <Link
      to="/profile?expandSection=children"
      className="sticky top-14 lg:top-[72px] left-0 right-0 z-40 
                 bg-red-500 text-white h-12 
                 grid place-items-center 
                 hover:bg-red-600 transition-colors
                 cursor-pointer w-full block"
    >
      <div className="flex items-center gap-4 px-4">
        <span className="text-base font-medium leading-none">
          Za začetek uporabe dodajte profil otroka.
        </span>
        <span className="bg-white text-gray-800 
                       px-5 py-1.5 rounded-full text-sm font-semibold 
                       leading-none transition-colors hover:bg-gray-100 shadow-sm">
          Dodaj
        </span>
      </div>
    </Link>
  );
};
