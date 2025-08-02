import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup, AgeGroup } from "@/utils/ageUtils";

const getRouteForAgeGroup = (ageGroup: AgeGroup): string => {
  return `/govorne-igre/sestavljanke/r/${ageGroup}`;
};


export default function SestavljankeR() {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('SestavljankeR useEffect - selectedChild:', selectedChild);
    
    if (!selectedChild) {
      // Redirect to profile setup if no child selected
      console.log('No child selected, redirecting to profile');
      navigate('/profile');
      return;
    }
    
    const childAge = selectedChild?.age ?? 4; // Default to 4
    const ageGroup = getAgeGroup(childAge);
    const targetRoute = getRouteForAgeGroup(ageGroup);
    
    console.log(`Redirecting child (age ${childAge}) to age group ${ageGroup}: ${targetRoute}`);
    navigate(targetRoute, { replace: true });
  }, [selectedChild, navigate]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4">Iščem primerno sestavljanko za tvojo starost...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
