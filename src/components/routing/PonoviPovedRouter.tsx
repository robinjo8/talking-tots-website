import { useParams, Navigate } from "react-router-dom";
import { PonoviPovedGame } from "@/components/games/PonoviPovedGame";
import { getPonoviPovedConfig } from "@/data/ponoviPovedConfig";

export default function PonoviPovedRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/ponovi-poved" replace />;
  }
  
  const config = getPonoviPovedConfig(letter);
  
  if (!config) {
    return <Navigate to="/govorne-igre/ponovi-poved" replace />;
  }
  
  return <PonoviPovedGame config={config} />;
}
