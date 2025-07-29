
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGroup, getAgeGroup, getRouteForAgeGroup, shouldAllowNextLevel } from "@/utils/ageUtils";

interface AgeGatedRouteProps {
  requiredAgeGroup: AgeGroup;
  children: React.ReactNode;
}

export function AgeGatedRoute({ requiredAgeGroup, children }: AgeGatedRouteProps) {
  const { profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childAge = selectedChild?.age;
  
  useEffect(() => {
    if (!selectedChild) {
      // Redirect to profile setup if no child selected
      navigate('/profile');
      return;
    }
    
    if (!childAge) {
      console.log('No age found for child:', selectedChild);
      // Redirect to profile setup if no age
      navigate('/profile');
      return;
    }
    
    const actualAgeGroup = getAgeGroup(childAge);
    console.log(`Child age: ${childAge}, actual age group: ${actualAgeGroup}, required: ${requiredAgeGroup}`);
    
    if (actualAgeGroup !== requiredAgeGroup) {
      // Check if child can access this level (within age range)
      const canAccessThisLevel = shouldAllowNextLevel(childAge, requiredAgeGroup);
      
      if (!canAccessThisLevel) {
        const correctRoute = getRouteForAgeGroup(actualAgeGroup);
        console.log(`Redirecting to correct route: ${correctRoute}`);
        navigate(correctRoute, { replace: true });
        return;
      }
    }
  }, [selectedChild, childAge, requiredAgeGroup, navigate]);
  
  if (!childAge) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-lg">Preusmerjam na nastavitve profila...</p>
    </div>;
  }
  
  const actualAgeGroup = getAgeGroup(childAge);
  const canAccessThisLevel = actualAgeGroup === requiredAgeGroup || shouldAllowNextLevel(childAge, requiredAgeGroup);
  
  if (!canAccessThisLevel) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-lg">Preusmerjam na primerno starostno skupino...</p>
    </div>;
  }
  
  return <>{children}</>;
}
