import { useParams, Navigate } from "react-router-dom";
import { getLabirintConfig } from "@/data/labirintConfig";
import { GenericLabirintGame } from "@/components/games/GenericLabirintGame";

export default function AdminLabirintRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/labirint`} replace />;
  }

  const config = getLabirintConfig(letter);
  
  if (!config) {
    console.warn(`AdminLabirintRouter: No config found for letter "${letter}"`);
    return <Navigate to={`/admin/children/${childId}/games/labirint`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/labirint`;

  return <GenericLabirintGame config={config} backPath={backPath} />;
}
