import { useParams, Navigate } from "react-router-dom";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { GenericIgraUjemanjaGame } from "@/components/games/GenericIgraUjemanjaGame";
import { parseIgraUjemanjaUrlParam, igraUjemanjaConfigByUrlKey } from "@/data/igraUjemanjaConfig";
import type { AgeGroup } from "@/utils/ageUtils";

export default function IgraUjemanjaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/igra-ujemanja" replace />;
  }

  // Decode and normalize the URL parameter
  const decodedParam = decodeURIComponent(letterAndAge).toLowerCase();
  
  // Handle legacy URLs with diacritics by converting to ASCII
  // č -> ch, š -> sh, ž -> zh
  let normalizedParam = decodedParam
    .replace(/č/g, 'ch')
    .replace(/š/g, 'sh')
    .replace(/ž/g, 'zh');
  
  // Try to find config
  let config = igraUjemanjaConfigByUrlKey[normalizedParam];
  
  // If not found directly, try parsing
  if (!config) {
    const parsed = parseIgraUjemanjaUrlParam(normalizedParam);
    if (parsed) {
      const key = parsed.ageGroup === '34' 
        ? parsed.urlKey 
        : `${parsed.urlKey}${parsed.ageGroup}`;
      config = igraUjemanjaConfigByUrlKey[key];
    }
  }

  if (!config) {
    console.warn(`IgraUjemanjaRouter: No config found for param "${letterAndAge}" (normalized: "${normalizedParam}")`);
    return <Navigate to="/govorne-igre/igra-ujemanja" replace />;
  }

  return (
    <AgeGatedRoute requiredAgeGroup={config.requiredAgeGroup as AgeGroup}>
      <GenericIgraUjemanjaGame config={config} />
    </AgeGatedRoute>
  );
}
