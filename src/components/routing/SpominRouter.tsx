import { useParams, Navigate } from "react-router-dom";
import { GenericSpominGame } from "@/components/games/GenericSpominGame";
import { findSpominConfig } from "@/data/spominConfig";

/**
 * Dynamic router for Spomin (Memory) games.
 * Parses URL parameter to determine which letter game to load.
 * 
 * URL format: /govorne-igre/spomin/:letterId
 * Examples:
 *   - /govorne-igre/spomin/spomin-c   -> Letter C
 *   - /govorne-igre/spomin/spomin-ch  -> Letter Č
 *   - /govorne-igre/spomin/spomin-sh  -> Letter Š
 *   - /govorne-igre/spomin/spomin-zh  -> Letter Ž
 * 
 * ASCII mapping for Slovenian diacritics:
 *   - č -> ch
 *   - š -> sh
 *   - ž -> zh
 */
export default function SpominRouter() {
  const { letterId } = useParams<{ letterId: string }>();
  
  if (!letterId) {
    console.warn("SpominRouter: Missing letterId parameter");
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  // Find config by URL parameter
  const config = findSpominConfig(letterId);
  
  if (!config) {
    console.warn(`SpominRouter: Config not found for: ${letterId}`);
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  return <GenericSpominGame config={config} />;
}
