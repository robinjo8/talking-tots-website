import { useParams, Navigate } from "react-router-dom";
import { PonoviPovedGame } from "@/components/games/PonoviPovedGame";
import { getPonoviPovedConfig } from "@/data/ponoviPovedConfig";

export default function AdminPonoviPovedRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/ponovi-poved`} replace />;
  }

  const config = getPonoviPovedConfig(letter);
  
  if (!config) {
    console.warn(`AdminPonoviPovedRouter: No config found for letter "${letter}"`);
    return <Navigate to={`/admin/children/${childId}/games/ponovi-poved`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/ponovi-poved`;

  return <PonoviPovedGame config={config} backPath={backPath} />;
}
