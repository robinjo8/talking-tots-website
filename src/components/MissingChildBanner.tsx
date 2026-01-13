import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

export const useBannerVisible = () => {
  const { user, profile } = useAuth();
  const { isSubscribed } = useSubscription();
  // Only show banner if user is logged in, HAS a subscription, but no children
  return user && isSubscribed && (!profile?.children || profile.children.length === 0);
};

export const MissingChildBanner = () => {
  const { user, profile } = useAuth();
  const { isSubscribed } = useSubscription();
  
  // Only show if user has subscription but no children
  const isVisible = user && isSubscribed && (!profile?.children || profile.children.length === 0);
  
  if (!isVisible) return null;
  
  return (
    <Link 
      to="/profile?expandSection=children" 
      className="bg-red-500 text-white h-12 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer w-full block"
    >
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
    </Link>
  );
};