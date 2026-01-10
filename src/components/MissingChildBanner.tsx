import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
export const useBannerVisible = () => {
  const {
    user,
    profile
  } = useAuth();
  return user && (!profile?.children || profile.children.length === 0);
};
export const MissingChildBanner = () => {
  const {
    user,
    profile
  } = useAuth();
  const isVisible = user && (!profile?.children || profile.children.length === 0);
  if (!isVisible) return null;
  return <Link to="/profile?expandSection=children" className="fixed top-14 lg:top-[72px] left-0 right-0 z-40 bg-red-500 text-white h-14 sm:h-12 flex items-end sm:items-center justify-center pb-2 sm:pb-0 hover:bg-red-600 transition-colors cursor-pointer w-full block my-[25px]">
      <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4 whitespace-nowrap">
        <span className="text-xs sm:text-base font-medium leading-none">
          Za začetek uporabe dodajte profil otroka.
        </span>
        <span className="bg-white text-gray-800 
                       px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold 
                       leading-none transition-colors hover:bg-gray-100 shadow-sm flex-shrink-0">
          Dodaj
        </span>
      </div>
    </Link>;
};