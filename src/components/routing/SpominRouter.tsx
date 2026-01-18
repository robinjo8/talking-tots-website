// Dynamic router for Spomin (Memory) games
// Parses URL parameters and renders GenericSpominGame with correct config

import { useParams, Navigate } from "react-router-dom";
import { GenericSpominGame } from "@/components/games/GenericSpominGame";
import { findConfigByUrlKey, configByUrlKey } from "@/data/spominConfig";

export default function SpominRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    console.error("SpominRouter: No letter parameter");
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  // Decode and normalize the URL parameter
  // Expected format: "spomin-c", "spomin-ch", "spomin-sh", etc.
  const decoded = decodeURIComponent(letter).toLowerCase();
  
  // Extract the letter key from "spomin-X" format
  const letterKey = decoded.startsWith('spomin-') 
    ? decoded.replace('spomin-', '') 
    : decoded;
  
  // Find the config
  const config = findConfigByUrlKey(letterKey);

  if (!config) {
    console.error(`SpominRouter: No config found for "${letterKey}"`);
    console.log("Available configs:", Object.keys(configByUrlKey));
    return <Navigate to="/govorne-igre/spomin" replace />;
  }

  console.log(`SpominRouter: Rendering game for letter ${config.letter}`);

  return <GenericSpominGame config={config} />;
}
