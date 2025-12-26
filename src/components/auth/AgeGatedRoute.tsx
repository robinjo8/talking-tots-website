
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGroup, getAgeGroup, shouldAllowNextLevel } from "@/utils/ageUtils";

interface AgeGatedRouteProps {
  requiredAgeGroup: AgeGroup;
  children: React.ReactNode;
}

// Helper function to get correct route based on current path and target age group
function getAgeSpecificRoute(currentPath: string, targetAgeGroup: AgeGroup): string {
  // Extract base path and current age suffix
  // Example: /govorne-igre/igra-ujemanja/č -> base is /govorne-igre/igra-ujemanja/č
  // Example: /govorne-igre/igra-ujemanja/č56 -> base is /govorne-igre/igra-ujemanja/č
  
  // Remove existing age suffix if present (34, 56, 78, 910)
  const cleanPath = currentPath.replace(/(34|56|78|910)$/, '');
  
  // Add new age suffix based on target age group
  const ageSuffixMap: Record<AgeGroup, string> = {
    '3-4': '', // No suffix for 3-4
    '5-6': '56',
    '7-8': '78',
    '9-10': '910'
  };
  
  return cleanPath + ageSuffixMap[targetAgeGroup];
}

export function AgeGatedRoute({ requiredAgeGroup, children }: AgeGatedRouteProps) {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  
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
        const correctRoute = getAgeSpecificRoute(location.pathname, actualAgeGroup);
        console.log(`Redirecting to correct route: ${correctRoute}`);
        navigate(correctRoute, { replace: true });
        return;
      }
    }
  }, [selectedChild, childAge, requiredAgeGroup, navigate, location.pathname]);
  
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
