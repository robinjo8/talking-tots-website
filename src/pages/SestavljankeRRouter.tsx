import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";

export default function SestavljankeRRouter() {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!selectedChild) {
      // Redirect to profile setup if no child selected
      navigate('/profile');
      return;
    }
    
    if (!selectedChild.age) {
      // Redirect to profile setup if no age
      navigate('/profile');
      return;
    }
    
    const childAge = selectedChild.age;
    const ageGroup = getAgeGroup(childAge);
    
    let targetRoute = '';
    switch (ageGroup) {
      case '3-4':
        targetRoute = '/govorne-igre/sestavljanke'; // 6 pieces
        break;
      case '5-6':
        targetRoute = '/govorne-igre/sestavljanke/r56'; // 12 pieces
        break;
      case '7-8':
        targetRoute = '/govorne-igre/sestavljanke/r78'; // 16 pieces
        break;
      case '9-10':
        targetRoute = '/govorne-igre/sestavljanke/r910'; // 20 pieces
        break;
      default:
        targetRoute = '/govorne-igre/sestavljanke/r'; // Default to 6 pieces
    }
    
    console.log(`Redirecting child (age ${childAge}, group ${ageGroup}) to: ${targetRoute}`);
    navigate(targetRoute, { replace: true });
  }, [selectedChild, navigate]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4">Iščem primerno starostno skupino za sestavljanko...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}