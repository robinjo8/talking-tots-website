// Dynamic router for Sestavljanke (Puzzle) games
// Parses URL parameters and renders GenericSestavljankaGame with correct config

import { useParams, Navigate } from "react-router-dom";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { GenericSestavljankaGame } from "@/components/games/GenericSestavljankaGame";
import { findConfigByParam, parseUrlParam, configByUrlKey } from "@/data/sestavljankeGameConfig";

export default function SestavljankeRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    console.error("SestavljankeRouter: No letterAndAge parameter");
    return <Navigate to="/govorne-igre/sestavljanke" replace />;
  }

  // Decode and normalize the URL parameter
  const decoded = decodeURIComponent(letterAndAge).toLowerCase();
  
  // Try direct lookup first
  let config = configByUrlKey[decoded];
  
  // If not found, try parsing
  if (!config) {
    const parsed = parseUrlParam(decoded);
    if (parsed) {
      const key = parsed.ageGroup === '34' 
        ? parsed.urlKey 
        : `${parsed.urlKey}${parsed.ageGroup}`;
      config = configByUrlKey[key];
    }
  }

  if (!config) {
    console.error(`SestavljankeRouter: No config found for "${decoded}"`);
    console.log("Available configs:", Object.keys(configByUrlKey));
    return <Navigate to="/govorne-igre/sestavljanke" replace />;
  }

  console.log(`SestavljankeRouter: Rendering game for ${config.letter} (${config.requiredAgeGroup}), grid: ${config.gridCols}x${config.gridRows}`);

  return (
    <AgeGatedRoute requiredAgeGroup={config.requiredAgeGroup as "3-4" | "5-6" | "7-8" | "9-10"}>
      <GenericSestavljankaGame config={config} />
    </AgeGatedRoute>
  );
}
