import { useParams, Navigate } from "react-router-dom";
import { getLabirintConfig } from "@/data/labirintConfig";
import { GenericLabirintGame } from "@/components/games/GenericLabirintGame";

/**
 * Dynamic router for Labirint (Maze) games
 * Matches URL parameter to labirint configuration and renders GenericLabirintGame
 */
export default function LabirintRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/labirint" replace />;
  }
  
  const config = getLabirintConfig(letter);
  
  if (!config) {
    console.warn(`LabirintRouter: No config found for letter "${letter}"`);
    return <Navigate to="/govorne-igre/labirint" replace />;
  }
  
  return <GenericLabirintGame config={config} />;
}
