import { useParams, Navigate } from "react-router-dom";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { GenericDrsnaSestavljankaGame } from "@/components/games/GenericDrsnaSestavljankaGame";
import { parseDrsnaSestavljankaUrlParam, drsnaSestavljankaConfigByUrlKey } from "@/data/drsnaSestavljankaConfig";
import type { AgeGroup } from "@/utils/ageUtils";

export default function DrsnaSestavljankaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/drsna-sestavljanka" replace />;
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
  let config = drsnaSestavljankaConfigByUrlKey[normalizedParam];
  
  // If not found directly, try parsing
  if (!config) {
    const parsed = parseDrsnaSestavljankaUrlParam(normalizedParam);
    if (parsed) {
      const key = parsed.ageGroup === '34' 
        ? parsed.urlKey 
        : `${parsed.urlKey}${parsed.ageGroup}`;
      config = drsnaSestavljankaConfigByUrlKey[key];
    }
  }

  if (!config) {
    console.warn(`DrsnaSestavljankaRouter: No config found for param "${letterAndAge}" (normalized: "${normalizedParam}")`);
    return <Navigate to="/govorne-igre/drsna-sestavljanka" replace />;
  }

  return (
    <AgeGatedRoute requiredAgeGroup={config.requiredAgeGroup as AgeGroup}>
      <GenericDrsnaSestavljankaGame config={config} />
    </AgeGatedRoute>
  );
}
