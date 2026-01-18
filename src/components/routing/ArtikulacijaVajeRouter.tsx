// Dynamic router for ArtikulacijaVaje games
// Replaces 18 individual page files with a single router
import { useParams, Navigate } from "react-router-dom";
import { getArtikulacijaConfig, type WordData, type BingoWordData } from "@/data/artikulacijaVajeConfig";
import { GenericWheelGame } from "@/components/games/GenericWheelGame";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";

export default function ArtikulacijaVajeRouter() {
  const { gameId } = useParams<{ gameId: string }>();
  
  if (!gameId) {
    return <Navigate to="/govorno-jezikovne-vaje/artikulacija" replace />;
  }

  const config = getArtikulacijaConfig(gameId);
  
  if (!config) {
    console.warn(`No config found for artikulacija game: ${gameId}`);
    return <Navigate to="/govorno-jezikovne-vaje/artikulacija" replace />;
  }

  if (config.gameType === 'wheel') {
    return (
      <GenericWheelGame
        letter={config.letter}
        displayLetter={config.displayLetter}
        title={config.title}
        wordsData={config.wordsData as WordData[]}
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
      />
    );
  }

  return <Navigate to="/govorno-jezikovne-vaje/artikulacija" replace />;
}
