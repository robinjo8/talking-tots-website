import { useParams, Navigate } from "react-router-dom";
import { GenericIgraUjemanjaGame } from "@/components/games/GenericIgraUjemanjaGame";
import { parseIgraUjemanjaUrlParam, igraUjemanjaConfigByUrlKey } from "@/data/igraUjemanjaConfig";

export default function AdminIgraUjemanjaRouter() {
  const { childId, letterAndAge } = useParams<{ childId: string; letterAndAge: string }>();
  
  if (!letterAndAge || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/igra-ujemanja`} replace />;
  }

  // Decode and normalize the URL parameter
  const decodedParam = decodeURIComponent(letterAndAge).toLowerCase();
  
  // Handle legacy URLs with diacritics by converting to ASCII
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
    console.warn(`AdminIgraUjemanjaRouter: No config found for "${normalizedParam}"`);
    return <Navigate to={`/admin/children/${childId}/games/igra-ujemanja`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/igra-ujemanja`;

  return <GenericIgraUjemanjaGame config={config} backPath={backPath} />;
}
