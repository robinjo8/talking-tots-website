
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup, getRouteForAgeGroup } from "@/utils/ageUtils";

export default function PoveziPareRouter() {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const childAge = selectedChild?.age ?? 4; // Default to 4
    const ageGroup = getAgeGroup(childAge);
    const targetRoute = getRouteForAgeGroup(ageGroup);
    
    console.log(`Redirecting child (age ${childAge}) to age group ${ageGroup}: ${targetRoute}`);
    navigate(targetRoute, { replace: true });
  }, [selectedChild, navigate]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4">Iščem primerno starostno skupino...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
