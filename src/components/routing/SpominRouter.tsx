import { useParams, Navigate } from "react-router-dom";
import { GenericSpominGame } from "@/components/games/GenericSpominGame";
import { getSpominConfigFromGameId } from "@/data/spominConfig";

export default function SpominRouter() {
  const { gameId } = useParams<{ gameId: string }>();
  
  if (!gameId) {
    console.error("SpominRouter: No gameId provided");
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  const config = getSpominConfigFromGameId(gameId);
  
  if (!config) {
    console.error(`SpominRouter: No config found for gameId: ${gameId}`);
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  return <GenericSpominGame config={config} />;
}
