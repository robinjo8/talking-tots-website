import { useParams, Navigate } from "react-router-dom";
import { GenericSpominGame } from "@/components/games/GenericSpominGame";
import { getSpominConfigFromGameId } from "@/data/spominConfig";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

export default function AdminSpominRouter() {
  const { childId, gameId } = useParams<{ childId: string; gameId: string }>();
  
  if (!gameId || !childId) {
    console.error("AdminSpominRouter: Missing gameId or childId");
    return <Navigate to={`/admin/children/${childId}/games/spomin`} replace />;
  }

  const config = getSpominConfigFromGameId(gameId);
  
  if (!config) {
    console.error(`AdminSpominRouter: No config found for gameId: ${gameId}`);
    return <Navigate to={`/admin/children/${childId}/games/spomin`} replace />;
  }

  return (
    <AdminGameWrapper 
      showBackButton={false}
      backPath={`/admin/children/${childId}/games/spomin`}
    >
      <GenericSpominGame config={config} />
    </AdminGameWrapper>
  );
}
