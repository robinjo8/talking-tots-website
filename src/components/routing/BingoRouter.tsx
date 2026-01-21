// Dynamic router for Bingo games under /govorne-igre
import { useParams, Navigate } from "react-router-dom";
import { getBingoConfig, type BingoWordData } from "@/data/artikulacijaVajeConfig";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";

export default function BingoRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/bingo" replace />;
  }

  const config = getBingoConfig(letter);
  
  if (!config) {
    console.warn(`No bingo config found for letter: ${letter}`);
    return <Navigate to="/govorne-igre/bingo" replace />;
  }

  return (
    <GenericBingoGame
      letter={config.letter}
      displayLetter={config.displayLetter}
      title={config.title}
      wordsData={config.wordsData as BingoWordData[]}
      exerciseId={config.exerciseId || `bingo_${config.letter.toLowerCase()}`}
      backPath="/govorne-igre/bingo"
    />
  );
}
