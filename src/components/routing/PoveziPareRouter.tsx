import { useParams, Navigate } from 'react-router-dom';
import { GenericPoveziPareSelection } from '@/components/games/GenericPoveziPareSelection';
import { GenericPoveziPareGame } from '@/components/games/GenericPoveziPareGame';
import { findPoveziPareConfig, isValidAgeGroup } from '@/data/poveziPareConfig';
import { AgeGatedRoute } from '@/components/auth/AgeGatedRoute';
import type { AgeGroup } from '@/utils/ageUtils';

export default function PoveziPareRouter() {
  const { ageGroup, letter } = useParams<{ ageGroup: string; letter?: string }>();

  // Validate age group
  if (!ageGroup || !isValidAgeGroup(ageGroup)) {
    console.warn(`PoveziPareRouter: Invalid age group "${ageGroup}"`);
    return <Navigate to="/govorne-igre" replace />;
  }

  // If no letter, show selection page
  if (!letter) {
    return <GenericPoveziPareSelection ageGroup={ageGroup} />;
  }

  // Find config for this letter and age group
  const config = findPoveziPareConfig(ageGroup, letter);
  
  if (!config) {
    console.warn(`PoveziPareRouter: No config found for letter "${letter}" in age group "${ageGroup}"`);
    return <Navigate to={`/govorne-igre/povezi-pare/${ageGroup}`} replace />;
  }

  // Render game with age gating
  return (
    <AgeGatedRoute requiredAgeGroup={config.requiredAgeGroup as AgeGroup}>
      <GenericPoveziPareGame config={config} />
    </AgeGatedRoute>
  );
}
