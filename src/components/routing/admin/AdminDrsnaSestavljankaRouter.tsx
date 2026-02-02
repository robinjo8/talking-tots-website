import { useParams, Navigate } from "react-router-dom";
import { GenericDrsnaSestavljankaGame } from "@/components/games/GenericDrsnaSestavljankaGame";
import { parseDrsnaSestavljankaUrlParam, drsnaSestavljankaConfigByUrlKey } from "@/data/drsnaSestavljankaConfig";

export default function AdminDrsnaSestavljankaRouter() {
  const { childId, letterAndAge } = useParams<{ childId: string; letterAndAge: string }>();
  
  if (!letterAndAge || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/drsna-sestavljanka`} replace />;
  }

  // Decode and normalize the URL parameter
  const decodedParam = decodeURIComponent(letterAndAge).toLowerCase();
  
  // Handle legacy URLs with diacritics by converting to ASCII
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
    console.warn(`AdminDrsnaSestavljankaRouter: No config found for "${normalizedParam}"`);
    return <Navigate to={`/admin/children/${childId}/games/drsna-sestavljanka`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/drsna-sestavljanka`;

  return <GenericDrsnaSestavljankaGame config={config} backPath={backPath} />;
}
