import { useParams, Navigate } from "react-router-dom";
import { GenericZaporedjaGame } from "@/components/games/GenericZaporedjaGame";
import { findZaporedjaConfig, parseZaporedjaUrlParam } from "@/data/zaporedjaConfig";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

export default function AdminZaporedjaRouter() {
  const { childId, letterAndAge } = useParams<{ childId: string; letterAndAge: string }>();
  
  if (!letterAndAge || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/zaporedja`} replace />;
  }

  const parsed = parseZaporedjaUrlParam(letterAndAge);
  if (!parsed) {
    console.warn(`AdminZaporedjaRouter: Invalid URL parameter: ${letterAndAge}`);
    return <Navigate to={`/admin/children/${childId}/games/zaporedja`} replace />;
  }

  const config = findZaporedjaConfig(letterAndAge);
  if (!config) {
    console.warn(`AdminZaporedjaRouter: Config not found for: ${letterAndAge}`);
    return <Navigate to={`/admin/children/${childId}/games/zaporedja`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/zaporedja`;

  return (
    <AdminGameWrapper 
      showBackButton={false}
      backPath={backPath}
    >
      <GenericZaporedjaGame config={config} backPath={backPath} />
    </AdminGameWrapper>
  );
}
