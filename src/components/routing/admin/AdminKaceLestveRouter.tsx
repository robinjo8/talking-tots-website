import { useParams, Navigate } from "react-router-dom";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";

export default function AdminKaceLestveRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();

  if (!letter || !childId || letter !== "c") {
    return <Navigate to={`/admin/children/${childId}/games/kace`} replace />;
  }

  return (
    <KaceLestveGame
      backPath={`/admin/children/${childId}/games/kace`}
      logopedistChildId={childId}
    />
  );
}
