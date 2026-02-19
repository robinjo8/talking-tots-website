import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";

export default function KaceLestveRouter() {
  const { letter } = useParams<{ letter: string }>();
  const { selectedChild } = useAuth();

  if (!letter || letter !== "c") {
    return <Navigate to="/govorne-igre/kace" replace />;
  }

  return (
    <KaceLestveGame
      backPath="/govorne-igre/kace"
      childId={selectedChild?.id}
    />
  );
}
