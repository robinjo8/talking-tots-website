import { useParams, Navigate } from "react-router-dom";
import { getWheelConfig, type WordData } from "@/data/artikulacijaVajeConfig";
import { GenericWheelGame } from "@/components/games/GenericWheelGame";

export default function AdminKoloSreceRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/kolo-srece`} replace />;
  }

  const config = getWheelConfig(letter);
  
  if (!config) {
    console.warn(`AdminKoloSreceRouter: No config found for letter "${letter}"`);
    return <Navigate to={`/admin/children/${childId}/games/kolo-srece`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/kolo-srece`;

  return (
    <GenericWheelGame
      letter={config.letter}
      displayLetter={config.displayLetter}
      title={config.title}
      wordsData={config.wordsData as WordData[]}
      backPath={backPath}
    />
  );
}
