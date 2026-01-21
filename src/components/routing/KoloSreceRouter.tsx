// Dynamic router for Kolo sreče (Fortune Wheel) games under /govorne-igre
import { useParams, Navigate } from "react-router-dom";
import { getWheelConfig, type WordData } from "@/data/artikulacijaVajeConfig";
import { GenericWheelGame } from "@/components/games/GenericWheelGame";

export default function KoloSreceRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/kolo-srece" replace />;
  }

  const config = getWheelConfig(letter);
  
  if (!config) {
    console.warn(`No wheel config found for letter: ${letter}`);
    return <Navigate to="/govorne-igre/kolo-srece" replace />;
  }

  return (
    <GenericWheelGame
      letter={config.letter}
      displayLetter={config.displayLetter}
      title={config.title}
      wordsData={config.wordsData as WordData[]}
      backPath="/govorne-igre/kolo-srece"
    />
  );
}
