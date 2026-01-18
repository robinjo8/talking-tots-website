import { useParams, Navigate } from "react-router-dom";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { GenericZaporedjaGame } from "@/components/games/GenericZaporedjaGame";
import { findZaporedjaConfig, parseZaporedjaUrlParam } from "@/data/zaporedjaConfig";
import type { AgeGroup } from "@/utils/ageUtils";

/**
 * Dynamic router for Zaporedja (Sequence) games.
 * Parses URL parameter to determine letter and age group.
 * 
 * URL format: /govorne-igre/zaporedja/:letterAndAge
 * Examples:
 *   - /govorne-igre/zaporedja/c     -> Letter C, age 3-4
 *   - /govorne-igre/zaporedja/ch56  -> Letter Č, age 5-6
 *   - /govorne-igre/zaporedja/sh910 -> Letter Š, age 9-10
 * 
 * ASCII mapping for Slovenian diacritics:
 *   - č -> ch
 *   - š -> sh
 *   - ž -> zh
 */
export default function ZaporedjaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    console.warn("ZaporedjaRouter: Missing letterAndAge parameter");
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }

  // Parse and find config
  const parsed = parseZaporedjaUrlParam(letterAndAge);
  if (!parsed) {
    console.warn(`ZaporedjaRouter: Invalid URL parameter: ${letterAndAge}`);
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }

  const config = findZaporedjaConfig(letterAndAge);
  if (!config) {
    console.warn(`ZaporedjaRouter: Config not found for: ${letterAndAge}`);
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }

  return (
    <AgeGatedRoute requiredAgeGroup={config.requiredAgeGroup as AgeGroup}>
      <GenericZaporedjaGame config={config} />
    </AgeGatedRoute>
  );
}
