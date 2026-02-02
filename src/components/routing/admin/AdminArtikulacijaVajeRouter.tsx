import { useParams, Navigate } from "react-router-dom";
import { getArtikulacijaConfig, type WordData, type BingoWordData } from "@/data/artikulacijaVajeConfig";
import { GenericWheelGame } from "@/components/games/GenericWheelGame";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";

export default function AdminArtikulacijaVajeRouter() {
  const { childId, gameId } = useParams<{ childId: string; gameId: string }>();
  
  if (!gameId) {
    return <Navigate to={`/admin/children/${childId}/exercises/artikulacija`} replace />;
  }

  const config = getArtikulacijaConfig(gameId);
  
  if (!config) {
    return <Navigate to={`/admin/children/${childId}/exercises/artikulacija`} replace />;
  }

  const backPath = `/admin/children/${childId}/exercises/artikulacija`;

  if (config.gameType === 'wheel') {
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

  if (config.gameType === 'bingo') {
    return (
      <GenericBingoGame
        letter={config.letter}
        displayLetter={config.displayLetter}
        title={config.title}
        wordsData={config.wordsData as BingoWordData[]}
        exerciseId={config.exerciseId || `artikulacija_bingo_${config.letter.toLowerCase()}`}
        backPath={backPath}
      />
    );
  }

  return <Navigate to={backPath} replace />;
}
