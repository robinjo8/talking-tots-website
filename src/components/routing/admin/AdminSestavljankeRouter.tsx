import { useParams, Navigate } from "react-router-dom";
import { GenericSestavljankaGame } from "@/components/games/GenericSestavljankaGame";
import { parseUrlParam, configByUrlKey } from "@/data/sestavljankeGameConfig";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

export default function AdminSestavljankeRouter() {
  const { childId, letterAndAge } = useParams<{ childId: string; letterAndAge: string }>();
  
  if (!letterAndAge || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/sestavljanke`} replace />;
  }

  // Decode and normalize the URL parameter
  const decoded = decodeURIComponent(letterAndAge).toLowerCase();
  
  // Try direct lookup first
  let config = configByUrlKey[decoded];
  
  // If not found, try parsing
  if (!config) {
    const parsed = parseUrlParam(decoded);
    if (parsed) {
      const key = parsed.ageGroup === '34' 
        ? parsed.urlKey 
        : `${parsed.urlKey}${parsed.ageGroup}`;
      config = configByUrlKey[key];
    }
  }

  if (!config) {
    console.warn(`AdminSestavljankeRouter: No config found for "${decoded}"`);
    return <Navigate to={`/admin/children/${childId}/games/sestavljanke`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/sestavljanke`;

  return (
    <AdminGameWrapper 
      showBackButton={false}
      backPath={backPath}
    >
      <GenericSestavljankaGame config={config} backPath={backPath} />
    </AdminGameWrapper>
  );
}
